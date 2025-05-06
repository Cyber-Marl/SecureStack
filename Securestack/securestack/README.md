# Securestack Website

A modern and professional website for Securestack, a technology solutions provider offering web development, software development, ERP development, graphic design, and consultancy services.

## Features

- Modern and responsive design with gold and black color scheme
- Services showcase
- Project portfolio with filtering
- Team member profiles
- Client testimonials
- Contact form with email integration
- Admin interface for content management

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/securestack.git
cd securestack
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root and add the following variables:
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser for the admin interface:
```bash
python manage.py createsuperuser
```

## Running the Development Server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your web browser to see the website.

## Admin Interface

Access the admin interface at `http://127.0.0.1:8000/admin/` using your superuser credentials.

## Project Structure

```
securestack/
├── apps/
│   └── core/
│       ├── admin.py
│       ├── models.py
│       ├── urls.py
│       ├── views.py
│       └── templates/
│           ├── base.html
│           ├── home.html
│           ├── services.html
│           ├── projects.html
│           ├── about.html
│           └── contact.html
├── static/
├── media/
├── templates/
├── manage.py
├── requirements.txt
└── README.md
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.