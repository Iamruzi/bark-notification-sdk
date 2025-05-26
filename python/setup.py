from setuptools import setup

setup(
    name="bark-notification-sdk",
    version="1.0.0",
    description="Python SDK for the Bark iOS push notification service",
    py_modules=["bark_sdk"],
    python_requires=">=3.6",
    install_requires=["requests"],
    author="",
    author_email="",
    url="https://github.com/Finb/Bark",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    keywords="bark, notification, push, ios, iphone, apns",
) 