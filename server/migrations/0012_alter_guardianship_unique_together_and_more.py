# Generated by Django 4.2.2 on 2023-07-25 03:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("server", "0011_razorpaytransaction_event"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="guardianship",
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name="guardianship",
            name="player",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="server.player"
            ),
        ),
    ]