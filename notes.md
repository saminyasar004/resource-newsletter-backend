# **Resource Newsletter**

A newsletter application that send mail about some usefull technical resource to the subscripted user's email in every week.

## **Author Schema**

-   `id`
-   `name`
-   `email` - **Unique**
-   `password`
-   `resources` **[{title, description, url}]**
-   `dayToSend` **sat|sun|mon|tue|wed|thu|fri**

`[{title: "Resource Title", description: "Resource Description", url: "http://resource.url.com"}, ...]`

## **Author Endpoints**

-   `/api/v1/author/` - `GET` - Get all the essential information of the application
-   `/api/v1/author/register` - `POST` - Register for author
-   `/api/v1/author/login` - `POST` - Login as author
-   `/api/v1/author/` - `PATCH` - Edit acceptable information of the author
-   `/api/v1/author/` - `DELETE` - Delete the author

## **Author Features**

-   The application can has only one author

## **Subscribers Schema**

-   `id`
-   `email`
-   `verified`
-   `subscribedAt`

## **Subscribers Endpoints**

-   `api/v1/newsletter/` - `POST` - Subscribe a new email address
-   `/api/v1/newsletter/verify/:id/:email/:subscribedAt` - `GET` - Verify an email address (via email)
-   `/api/v1/newsletter/verify/:id/:email/:subscribedAt` - `DELETE` - Unsubscribe an email address (via email)
