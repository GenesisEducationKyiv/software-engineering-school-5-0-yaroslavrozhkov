# ADR #1 08.04.2025
# Use Prisma as the ORM for Type-Safe Database Access

## Status
Accepted

## Context
We require an Object-Relational Mapping (ORM) tool to interact with our PostgreSQL database from a TypeScript-based backend. The ORM should provide:

- Type safety to reduce runtime errors.
- Intuitive query syntax for improved developer productivity.
- Schema management and migration tooling.
- Compatibility with PostgreSQL.
- Good developer experience and community support.

## Decision
We have chosen to use **Prisma** as our ORM for database access.

Prisma offers a declarative data modeling experience, auto-generates types based on the schema, and provides a modern, readable query syntax. It also simplifies migrations and integrates well into CI/CD pipelines.

## Consequences

**Easier:**
- Type-safe queries reduce runtime errors and improve developer confidence.
- Clear and readable query syntax improves maintainability.
- Automatic generation of types and CRUD operations increases development speed.

**More Difficult:**
- Prisma’s abstraction may not support every advanced PostgreSQL feature out-of-the-box.
- Less flexibility compared to raw SQL or lower-level ORMs in complex query scenarios.
- Learning curve associated with Prisma’s data model and migration system.
- Migrations can become complex when managing multiple environments or legacy databases.

# ADR #2 10.05.2025
# Use SendGrid as the Email Service Provider

## Status
Accepted

## Context
Our application requires the ability to send transactional and notification emails, such as account verification, password resets, and system alerts. The chosen email service must be reliable, scalable, and easy to integrate with a Node.js/TypeScript backend. It should also offer features like:

- API-based email sending
- Free to use
- Email templating (optional)
- Security features such as domain authentication and API key management

## Decision
We have decided to use **SendGrid** as our external email service provider.

SendGrid provides a robust REST API, high deliverability rates, and detailed analytics. It also integrates easily into a TypeScript/Node.js stack using their official SDK and supports features like domain authentication and email templates.

## Consequences

**Easier:**
- No need to manage SMTP servers or email infrastructure.
- Improved email deliverability and monitoring via SendGrid’s dashboard.
- Secure API key access and domain authentication features enhance security.

**More Difficult:**
- Must monitor and stay within SendGrid’s rate limits and pricing tiers.
- Requires proper configuration of DNS records (SPF, DKIM, DMARC) for domain authentication.
- Debugging email delivery issues may require coordination with SendGrid support.

# ADR #3 12.06.2025
# Use Contabo.com as the VPS Hosting Provider

## Status
Accepted

## Context
We need a reliable and cost-effective infrastructure solution to host our backend services, including the application server and database. The hosting solution should offer:

- Full root access for custom server configurations
- Sufficient CPU, RAM, and storage resources for expected workloads
- Affordable pricing for early-stage development and deployment
- Compatibility with standard Linux distributions and Docker


## Decision
We have chosen **Contabo.com** as our VPS hosting provider.

Contabo offers competitively priced virtual servers with generous resource allocations, full root access, and flexible configuration options. This makes it well-suited for self-managed deployments and development environments.

## Consequences

**Easier:**
- Significantly lower hosting costs compared to major cloud providers.
- Predictable billing with no hidden or usage-based fees.
- Can host multiple services (e.g., app server, database) on a single VPS if needed.

**More Difficult:**
- Manual setup and maintenance of servers, including updates, security patches, and backups.
- No built-in autoscaling or managed services like databases or load balancers.
- Less geographical distribution and redundancy compared to major cloud providers.