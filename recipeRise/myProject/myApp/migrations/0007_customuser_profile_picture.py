# Generated by Django 5.0.2 on 2024-04-16 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myApp", "0006_rename_saved_at_savedrecipe_saved_on_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="profile_picture",
            field=models.ImageField(blank=True, null=True, upload_to="profile_pics/"),
        ),
    ]