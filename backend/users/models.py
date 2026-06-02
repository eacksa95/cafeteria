from djongo import models


class UserProfile(models.Model):
    user_id  = models.IntegerField(primary_key=True)
    foto_url = models.CharField(max_length=500, blank=True, default='')

    class Meta:
        db_table = 'user_profiles'
