# Haven App

To run the server:

1) Go into haven folder where you can find `manage.py`
2) Run `python manage.py runserver`

GraphQL Query example:
```
{
  users{
    username,
    id,
    email
    
  }
}
```

Keep in mind you will have to seed the database before you can query. You can try the following steps:

1) Activate virutal machine by running `source bin/activate` in the repository (not the haven folder)
2) You need to run migrations, run the following: `python3 manage.py makemigrations havenapp` and then `python3 manage.py migrate  havenapp`
3) Then you can go into shell by doing: `python manage.py shell`. This will allow you to access the model object so you can initialize it with a bunch of data. However, I recommend we just have a way to make users now as our next task)
