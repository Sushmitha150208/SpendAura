from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='categories')
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='tag')
    color = models.CharField(max_length=50, default='#E76F51')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    PAYMENT_CHOICES = (
        ('UPI', 'UPI'),
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('Cash', 'Cash'),
        ('Net Banking', 'Net Banking'),
        ('Other', 'Other'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='expense')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    date_time = models.DateTimeField(default=timezone.now)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_CHOICES, default='UPI')
    note = models.CharField(max_length=255, blank=True, default='')
    receipt = models.ImageField(upload_to='receipts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_time', '-created_at']

    def __str__(self):
        return f"{self.type.upper()}: {self.amount} ({self.note or self.category})"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='budgets')
    month = models.CharField(max_length=7) # e.g. "2026-11"
    limit_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'category', 'month')

    def __str__(self):
        return f"Budget: {self.category.name} - {self.month} - {self.limit_amount}"

    @property
    def spent_amount(self):
        # Calculate sum of expenses for this user, category, and month
        total = Transaction.objects.filter(
            user=self.user,
            category=self.category,
            type='expense',
            date_time__startswith=self.month
        ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
        return total

    @property
    def percentage_used(self):
        if self.limit_amount and self.limit_amount > 0:
            pct = (float(self.spent_amount) / float(self.limit_amount)) * 100.0
            return round(pct, 1)
        return 0.0

class Goal(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    name = models.CharField(max_length=150)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    saved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    target_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    icon = models.CharField(max_length=50, default='laptop')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.saved_amount}/{self.target_amount})"

    @property
    def percentage_saved(self):
        if self.target_amount and self.target_amount > 0:
            return round((float(self.saved_amount) / float(self.target_amount)) * 100.0, 1)
        return 0.0

class Notification(models.Model):
    TYPE_CHOICES = (
        ('budget_warning', 'Budget Warning'),
        ('goal_milestone', 'Goal Milestone'),
        ('reminder', 'Reminder'),
        ('system', 'System'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='system')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type}] {self.message}"
