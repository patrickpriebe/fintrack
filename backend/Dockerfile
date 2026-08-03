FROM composer:2.8 AS vendor

WORKDIR /app

COPY backend/composer.json backend/composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY backend/ ./
RUN composer run-script post-autoload-dump

FROM php:8.3-apache AS production

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    PORT=10000

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
COPY docker/entrypoint.sh /usr/local/bin/fintrack-entrypoint

RUN mkdir -p bootstrap/cache \
    && chmod +x /usr/local/bin/fintrack-entrypoint \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl --fail --silent "http://127.0.0.1:${PORT}/up" > /dev/null || exit 1

ENTRYPOINT ["fintrack-entrypoint"]
CMD ["apache2-foreground"]
