#!/bin/sh

npx prisma migrate deploy

npm run process-subscriptions &

npm run start