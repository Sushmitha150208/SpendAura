from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import Category, Transaction, Budget, Goal, Notification
from .serializers import (
    CategorySerializer, TransactionSerializer, 
    BudgetSerializer, GoalSerializer, NotificationSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        if user:
            return Category.objects.filter(Q(user=user) | Q(is_default=True))
        return Category.objects.all()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    def perform_destroy(self, instance):
        # FR-22: Deleting a category shall move its transactions to Others
        others_cat, _ = Category.objects.get_or_create(
            name='Others',
            defaults={'icon': 'more-horizontal', 'color': '#94A3B8', 'is_default': True}
        )
        instance.transactions.all().update(category=others_cat)
        instance.delete()

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        queryset = Transaction.objects.all()
        if user:
            queryset = queryset.filter(user=user)

        # Filters
        tx_type = self.request.query_params.get('type')
        if tx_type:
            queryset = queryset.filter(type=tx_type)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(Q(note__icontains=search) | Q(category__name__icontains=search))

        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(date_time__date__gte=start_date)

        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(date_time__date__lte=end_date)

        min_amount = self.request.query_params.get('min_amount')
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)

        max_amount = self.request.query_params.get('max_amount')
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)

        # Sorting
        sort_by = self.request.query_params.get('ordering', '-date_time')
        return queryset.order_by(sort_by)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if not user and Transaction.objects.first():
            user = Transaction.objects.first().user
        serializer.save(user=user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        queryset = Budget.objects.all()
        if user:
            queryset = queryset.filter(user=user)
        month = self.request.query_params.get('month')
        if month:
            queryset = queryset.filter(month=month)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        queryset = Goal.objects.all()
        if user:
            queryset = queryset.filter(user=user)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    @action(detail=True, methods=['post'])
    def add_money(self, request, pk=None):
        goal = self.get_object()
        amount = Decimal(str(request.data.get('amount', 0)))
        if amount <= 0:
            return Response({'error': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        goal.saved_amount += amount
        if goal.saved_amount >= goal.target_amount:
            goal.status = 'completed'
            # Create celebratory notification (FR-28)
            Notification.objects.create(
                user=goal.user,
                message=f"🎉 Congratulations! You reached your savings goal: {goal.name}!",
                type='goal_milestone'
            )
        goal.save()
        return Response(GoalSerializer(goal).data)

    @action(detail=True, methods=['post'])
    def withdraw_money(self, request, pk=None):
        goal = self.get_object()
        amount = Decimal(str(request.data.get('amount', 0)))
        if amount <= 0:
            return Response({'error': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)
        if amount > goal.saved_amount:
            return Response({'error': 'Cannot withdraw more than saved amount.'}, status=status.HTTP_400_BAD_REQUEST)

        goal.saved_amount -= amount
        if goal.saved_amount < goal.target_amount and goal.status == 'completed':
            goal.status = 'active'
        goal.save()
        return Response(GoalSerializer(goal).data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        if user:
            return Notification.objects.filter(user=user)
        return Notification.objects.all()

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        queryset = self.get_queryset()
        queryset.update(is_read=True)
        return Response({'status': 'all marked read'})

class SummaryView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = self.request.user if self.request.user.is_authenticated else None
        txs = Transaction.objects.all()
        if user:
            txs = txs.filter(user=user)

        total_income = txs.filter(type='income').aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        total_expense = txs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        savings = total_income - total_expense
        total_balance = savings

        # Category breakdown
        category_breakdown = []
        if total_expense > 0:
            for cat in Category.objects.all():
                cat_expense = txs.filter(type='expense', category=cat).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
                if cat_expense > 0:
                    pct = round((float(cat_expense) / float(total_expense)) * 100, 1)
                    category_breakdown.append({
                        'category_id': cat.id,
                        'name': cat.name,
                        'icon': cat.icon,
                        'color': cat.color,
                        'amount': float(cat_expense),
                        'percentage': pct,
                    })

        # Recent transactions (top 3)
        recent_txs = TransactionSerializer(txs.order_by('-date_time')[:3], many=True).data

        # Budgets
        budgets = Budget.objects.all()
        if user:
            budgets = budgets.filter(user=user)
        budget_data = BudgetSerializer(budgets[:3], many=True).data

        # Active Goal
        active_goal = Goal.objects.filter(status='active').first()
        goal_data = GoalSerializer(active_goal).data if active_goal else None

        return Response({
            'total_balance': float(total_balance),
            'total_income': float(total_income),
            'total_expense': float(total_expense),
            'savings': float(savings),
            'category_breakdown': category_breakdown,
            'recent_transactions': recent_txs,
            'budget_progress': budget_data,
            'active_goal': goal_data,
        })

class ReportsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        period = request.query_params.get('period', 'monthly')
        txs = Transaction.objects.all()

        # Monthly overview for last 6 months
        months_data = []
        now = timezone.now()
        for i in range(5, -1, -1):
            dt = now - timedelta(days=i*30)
            month_str = dt.strftime('%b')
            month_key = dt.strftime('%Y-%m')
            
            inc = txs.filter(type='income', date_time__startswith=month_key).aggregate(t=Sum('amount'))['t'] or Decimal('0.00')
            exp = txs.filter(type='expense', date_time__startswith=month_key).aggregate(t=Sum('amount'))['t'] or Decimal('0.00')
            
            months_data.append({
                'month': month_str,
                'income': float(inc),
                'expense': float(exp)
            })

        return Response({
            'period': period,
            'monthly_overview': months_data,
        })
