from rest_framework import serializers
from .models import Category, Transaction, Budget, Goal, Notification

class CategorySerializer(serializers.ModelSerializer):
    transactions_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'is_default', 'transactions_count', 'total_spent', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_transactions_count(self, obj):
        return obj.transactions.count()

    def get_total_spent(self, obj):
        total = sum(t.amount for t in obj.transactions.filter(type='expense'))
        return float(total)

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_icon = serializers.ReadOnlyField(source='category.icon')
    category_color = serializers.ReadOnlyField(source='category.color')

    class Meta:
        model = Transaction
        fields = [
            'id', 'type', 'amount', 'category', 'category_name', 
            'category_icon', 'category_color', 'date_time', 
            'payment_method', 'note', 'receipt', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_icon = serializers.ReadOnlyField(source='category.icon')
    category_color = serializers.ReadOnlyField(source='category.color')
    spent_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    percentage_used = serializers.FloatField(read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id', 'category', 'category_name', 'category_icon', 
            'category_color', 'month', 'limit_amount', 
            'spent_amount', 'percentage_used', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class GoalSerializer(serializers.ModelSerializer):
    percentage_saved = serializers.FloatField(read_only=True)

    class Meta:
        model = Goal
        fields = [
            'id', 'name', 'target_amount', 'saved_amount', 
            'target_date', 'status', 'icon', 'percentage_saved', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'type', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']
