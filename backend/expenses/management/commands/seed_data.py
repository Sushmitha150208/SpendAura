from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal
from datetime import timedelta
from expenses.models import Category, Transaction, Budget, Goal, Notification

class Command(BaseCommand):
    help = 'Seeds initial SpendAura demo data matching the UI template'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding SpendAura data...')

        user, created = User.objects.get_or_create(
            username='sushmitha',
            defaults={
                'email': 'sushmitha@spendaura.com',
                'first_name': 'Sushmitha',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            if hasattr(user, 'profile'):
                user.profile.currency = '₹'
                user.profile.save()

        # Categories
        cat_defs = [
            ('Food & Dining', 'utensils', '#E76F51'),
            ('Transport', 'car', '#F4A261'),
            ('Shopping', 'shopping-bag', '#E9C46A'),
            ('Bills & Utilities', 'home', '#8338EC'),
            ('Health', 'heart-pulse', '#FF006E'),
            ('Others', 'more-horizontal', '#94A3B8'),
        ]

        cats = {}
        for name, icon, color in cat_defs:
            c, _ = Category.objects.get_or_create(
                name=name,
                defaults={'icon': icon, 'color': color, 'is_default': True, 'user': user}
            )
            cats[name] = c

        # Clear old transactions
        Transaction.objects.filter(user=user).delete()

        # Seed Income
        Transaction.objects.create(
            user=user,
            type='income',
            amount=Decimal('35000.00'),
            category=cats['Others'],
            date_time=timezone.now() - timedelta(days=5),
            payment_method='Net Banking',
            note='Monthly Salary'
        )

        # Seed Expenses matching mockup
        now = timezone.now()
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('2350.00'),
            category=cats['Food & Dining'],
            date_time=now - timedelta(hours=1, minutes=15),
            payment_method='UPI',
            note='Grocery'
        )
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('850.00'),
            category=cats['Food & Dining'],
            date_time=now - timedelta(days=1, hours=3),
            payment_method='Credit Card',
            note='Restaurant'
        )
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('120.00'),
            category=cats['Transport'],
            date_time=now - timedelta(days=3),
            payment_method='UPI',
            note='Transport'
        )
        # Additional transactions to match category distribution and total ₹ 16,550
        # Food & Dining: 34% of 16550 = ~5,627 (we have 2350 + 850 = 3200, add 2427)
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('2427.00'),
            category=cats['Food & Dining'],
            date_time=now - timedelta(days=8),
            payment_method='Credit Card',
            note='Supermarket & Pantry supplies'
        )
        # Transport: 18% of 16550 = ~2,979 (we have 120, add 2859)
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('2859.00'),
            category=cats['Transport'],
            date_time=now - timedelta(days=10),
            payment_method='UPI',
            note='Fuel & Metro Pass'
        )
        # Shopping: 15% of 16550 = ~2,482
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('2482.00'),
            category=cats['Shopping'],
            date_time=now - timedelta(days=12),
            payment_method='Credit Card',
            note='Clothing & Books'
        )
        # Bills & Utilities: 12% of 16550 = ~1,986
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('1986.00'),
            category=cats['Bills & Utilities'],
            date_time=now - timedelta(days=14),
            payment_method='Net Banking',
            note='Electricity & Wi-Fi'
        )
        # Health: 10% of 16550 = ~1,655
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('1655.00'),
            category=cats['Health'],
            date_time=now - timedelta(days=16),
            payment_method='UPI',
            note='Pharmacy & Vitamins'
        )
        # Others: 11% of 16550 = ~1,821 - 150 adjustment to reach exactly ₹ 16,550 total
        Transaction.objects.create(
            user=user,
            type='expense',
            amount=Decimal('1671.00'),
            category=cats['Others'],
            date_time=now - timedelta(days=18),
            payment_method='Cash',
            note='Miscellaneous home essentials'
        )

        # Budgets
        Budget.objects.filter(user=user).delete()
        month_str = now.strftime('%Y-%m')
        Budget.objects.create(user=user, category=cats['Food & Dining'], month=month_str, limit_amount=Decimal('6000.00'))
        Budget.objects.create(user=user, category=cats['Shopping'], month=month_str, limit_amount=Decimal('4000.00'))
        Budget.objects.create(user=user, category=cats['Bills & Utilities'], month=month_str, limit_amount=Decimal('2500.00'))

        # Goal
        Goal.objects.filter(user=user).delete()
        Goal.objects.create(
            user=user,
            name='Save for a Laptop',
            target_amount=Decimal('60000.00'),
            saved_amount=Decimal('18450.00'),
            target_date=now.date() + timedelta(days=90),
            status='active',
            icon='laptop'
        )

        # Notifications
        Notification.objects.filter(user=user).delete()
        Notification.objects.create(
            user=user,
            message='Food & Dining is at 87% of its monthly budget limit.',
            type='budget_warning'
        )
        Notification.objects.create(
            user=user,
            message='You have saved ₹ 18,450 (30.7%) for your Laptop goal!',
            type='goal_milestone'
        )

        self.stdout.write(self.style.SUCCESS('SpendAura data seeded successfully!'))
