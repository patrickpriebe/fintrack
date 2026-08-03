FROM node:22-alpine AS frontend
WORKDIR /app/frontend
ENV VITE_BASE_PATH=/app/
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM composer:2.8 AS vendor
WORKDIR /app
COPY backend/ ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader

FROM php:8.3-apache AS production

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    PORT=80

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl libicu-dev libpq-dev libzip-dev unzip \
    && docker-php-ext-install -j"$(nproc)" intl opcache pdo_pgsql zip \
    && a2enmod rewrite headers expires \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php/production.ini /usr/local/etc/php/conf.d/99-fintrack.ini
COPY backend/ ./
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/frontend/dist ./public/app
COPY docker/entrypoint.sh /usr/local/bin/fintrack-entrypoint

RUN mkdir -p bootstrap/cache \
    && chmod +x /usr/local/bin/fintrack-entrypoint \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl --fail --silent "http://127.0.0.1:${PORT}/up" > /dev/null || exit 1

ENTRYPOINT ["fintrack-entrypoint"]
CMD ["apache2-foreground"]
