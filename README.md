# Django + NextJs Application

In my Django + Next.js application, users can sign up and perform CRUD operations (Create, Read, Update, Delete) on notes.

# Backend Flow (Django)
![image](https://github.com/user-attachments/assets/aead184a-68b2-401c-b740-c91f9ef8ca3b)

1. User visits the site URL.
2. In the Django backend, the request first goes to the root urls.py file.
3. Django tries to match the incoming URL with a route defined in urls.py.
   - If a match is found, it maps the URL to the corresponding view function or class-based view.
4. The view function handles the request.
   - If the view needs to interact with the database, it calls the appropriate model.
   - In models.py, Django uses its ORM (Object-Relational Mapping) to query or modify the database.
5. The result is passed back to the view.
   - If the response needs to be returned as JSON (for APIs), a serializer is used to convert Python objects to JSON format (and vice versa for incoming data).
6. Finally, the view returns a response to the frontend:
   - Either an HTML page (for traditional views)
   - Or a JSON response (for APIs)

