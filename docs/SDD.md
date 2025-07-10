# System Design Document

## System Overview


## 1. Goals and Objectives

### Goals:

Provide users with up-to-date weather information based on city or location.
Enable users to subscribe to weather updates via email.
Ensure secure, scalable, and maintainable architecture for public usage.
Maintain high reliability and uptime via VPS hosting.

### Objectives:

Build a RESTful API for fetching weather data and managing subscriptions.
Integrate with WeatherAPI.com to retrieve accurate and real-time weather information.
Use SendGrid to handle email confirmations, subscriptions, and unsubscriptions.
Store subscriber and token data in a PostgreSQL database with Prisma ORM.

## 2. Requirements

### Functional Requirements

1: The system shall provide an endpoint to retrieve the current weather data for a specified city.

2: The system shall fetch weather data from a third-party weather provider WeatherAPI.com.

3: The system shall validate and return weather information including temperature, humidity and weather description.

4: The system shall provide an endpoint to allow users to subscribe to daily weather emails by submitting their email address and desired location.

5: The system shall send a daily email to all subscribers containing the current weather for their subscribed location.

6: The system shall provide an endpoint to allow users to unsubscribe.

### Non-Functional Requirements

1: Availability - The system shall have at least 99.9% uptime to ensure reliable access to weather data and subscription services.

2: Scalability - The system shall be able to handle increasing load from user subscriptions and concurrent weather data requests.

3: Security - User data shall be securely stored and transmitted using HTTPS and encryption where appropriate.

4: Performance - The endpoint that return current weather shall respond within 500 ms for 95% of requests under normal operating conditions.

### Limitation

1: The email service provider SendGrid used for sending daily weather emails imposes a limit of 1,000 emails per day;

2: The third-party WeatherAPI.com weather API allows up to 500,000 requests per month;


## 3. Component Design

### 3.1 Frontend

Technology: JS + HTML

Responsibilities:

Calls backend APIs via Axios
Displays weather data and subscription status
Confirmation and unsubscribe pages

### 3.2 Backend

Technology: Node.js + TypeScript

Modules:
Weather: Fetch current weather from WeatherAPI.com
Subscriptions: Handle email subscriptions and unsubscriptions
Email Service: Send confirmation emails via SendGrid

### 3.3 Database (PostgreSQL)
ORM: Prisma

Stores:
Subscriber emails
Confirmation status and timestamps

### 3.4 Email Delivery (SendGrid)

Responsibilities:

Send email with weather
Send confirmation emails
Send unsubscribe confirmation

### 3.5 Deployment (Contabo VPS)

Technology: Ubuntu + Docker

Responsibilities:
Host frontend and backend, DB server

## 4. API Design

### RESTful endpoints:

RESTful endpoints:

`GET /weather`
Returns current weather data for a given city or coordinates.

`POST /subscribe`
Submits an email and optional location to subscribe for weather updates.

`GET /confirm/:token`
Confirms a subscription using the provided email token.

`GET /unsubscribe/:token`
Cancels a subscription via token.

Uses standard HTTP response codes.

## 5. High-Level Architecture

```text
        +------+
        | User |
        +--+---+
           |
   +-------+--------+
   |                |
   v                v
+------------+   +-------------+
|  Web page  |   |   Web API   |
+------------+   +-------------+
       \            /
        \          /
         v        v
         +----------+
        | API      |
        | Gateway  |
        +----------+
             |
             v
      +---------------+
      |  Web service  |
      +---+-------+---+
          |       |
          v       v
+------------+  +----------------+
| Weather    |  |   Mail sender  |
| provider   |  +----------------+
+------------+
        |
        v
     +-------------------+
     |  DB PostgreSQL    |
     +-------------------+