# **Resource Newsletter (Server)**

A newsletter application that send mail about some usefull technical resource to the subscripted user's email in every week.

[![Website](https://img.shields.io/website?label=saminyasar%20🚀&name=hello&style=flat&url=https://saminyasar.netlify.app/)](https://saminyasar.netlify.app/)
[![Facebook Follow](https://img.shields.io/badge/Facebook-Follow-brightgreen)](https://www.facebook.com/saminyasar004/)
[![Facebook Page](https://img.shields.io/badge/Facebook-Page-brightgreen)](https://www.facebook.com/saminyasar04/)
[![Instagram Follow](https://img.shields.io/badge/Instagram-Follow-brightgreen)](https://instagram.com/saminyasar004/)
[![Twitter Follow](https://img.shields.io/badge/Twitter-Follow-brightgreen)](https://twitter.com/saminyasar004/)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-Questions-brightgreen)](https://stackoverflow.com/users/14735945/samin-yasar)
[![Github Follow](https://img.shields.io/github/followers/saminyasar004?label=saminyasar004&style=social)](https://github.com/saminyasar004/)

## **API Reference**

### **Author Endpoints**

#### **Get essential information for Author**

```http
  GET /api/v1/author
```

| Header         | Type     | Description                                 |
| :------------- | :------- | :------------------------------------------ |
| `Bearer Token` | `string` | **Required**. Your JWT Authentication Token |

#### **Registration for Author**

```http
  POST /api/v1/author/register
```

| Body (JSON) | Type     | Example                                                                                                 | Description                       |
| :---------- | :------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------- |
| `name`      | `string` | `John Smith`                                                                                            | **Required**. Your Full Name      |
| `email`     | `string` | `john.smith@example.com`                                                                                | **Required**. Your Valid Email    |
| `password`  | `string` | `password`                                                                                              | **Required**. Your Password       |
| `resources` | `string` | `[{title: "Resource Title", description: "Resource Description", url: "http://resource.url.com"}, ...]` | **Required**. Your Resources      |
| `dayToSend` | `string` | `sat\|sun\|mon\|tue\|wed\|thu\|fri`                                                                     | **Required**. Shortname of a day. |

#### **Login for Author**

```http
  POST /api/v1/author/login
```

| Body (JSON) | Type     | Example                  | Description                    |
| :---------- | :------- | :----------------------- | :----------------------------- |
| `email`     | `string` | `john.smith@example.com` | **Required**. Your Valid Email |
| `password`  | `string` | `password`               | **Required**. Your Password    |

#### **Edit Author**

```http
  PATCH /api/v1/author
```

| Body (JSON) | Type     | Example                                                                                                 | Description         |
| :---------- | :------- | :------------------------------------------------------------------------------------------------------ | :------------------ |
| `name`      | `string` | `John Smith`                                                                                            | Your Full Name      |
| `password`  | `string` | `password`                                                                                              | Your Password       |
| `resources` | `string` | `[{title: "Resource Title", description: "Resource Description", url: "http://resource.url.com"}, ...]` | Your Resources      |
| `dayToSend` | `string` | `sat\|sun\|mon\|tue\|wed\|thu\|fri`                                                                     | Shortname of a day. |

#### **Delete Author**

```http
  DELETE /api/v1/author
```

### **Subscribers Endpoints**

#### **Subscribe for a new Email address**

```http
  POST api/v1/newsletter
```

| Body (JSON) | Type     | Example                  | Description                    |
| :---------- | :------- | :----------------------- | :----------------------------- |
| `email`     | `string` | `john.smith@example.com` | **Required**. Your Valid Email |

#### Happy Coding 🚀
