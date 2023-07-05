# Generated by Django 4.2.2 on 2023-07-05 13:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("server", "0002_player_not_in_india_alter_player_gender_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="player",
            name="other_gender",
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name="player",
            name="state_ut",
            field=models.CharField(
                choices=[
                    ("AN", "Andaman and Nicobar Islands"),
                    ("AP", "Andhra Pradesh"),
                    ("AR", "Arunachal Pradesh"),
                    ("AS", "Assam"),
                    ("BR", "Bihar"),
                    ("CDG", "Chandigarh"),
                    ("CG", "Chhattisgarh"),
                    ("DNH", "Dadra and Nagar Haveli"),
                    ("DD", "Daman and Diu"),
                    ("DL", "Delhi"),
                    ("GA", "Goa"),
                    ("GJ", "Gujarat"),
                    ("HR", "Haryana"),
                    ("HP", "Himachal Pradesh"),
                    ("JK", "Jammu and Kashmir"),
                    ("JH", "Jharkhand"),
                    ("KA", "Karnataka"),
                    ("KL", "Kerala"),
                    ("LK", "Ladakh"),
                    ("LD", "Lakshadweep"),
                    ("MP", "Madhya Pradesh"),
                    ("MH", "Maharashtra"),
                    ("MN", "Manipur"),
                    ("ML", "Meghalaya"),
                    ("MZ", "Mizoram"),
                    ("NL", "Nagaland"),
                    ("OR", "Odisha"),
                    ("PY", "Puducherry"),
                    ("PB", "Punjab"),
                    ("RJ", "Rajasthan"),
                    ("SK", "Sikkim"),
                    ("TN", "Tamil Nadu"),
                    ("TL", "Telangana"),
                    ("TR", "Tripura"),
                    ("UP", "Uttar Pradesh"),
                    ("UK", "Uttarakhand"),
                    ("WB", "West Bengal"),
                ],
                max_length=5,
                null=True,
            ),
        ),
    ]
