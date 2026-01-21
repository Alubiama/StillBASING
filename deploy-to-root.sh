#!/bin/bash

# 🚀 Автоматический deployment в alubiama.github.io
# Этот скрипт НЕ требует DEPLOY_TOKEN в GitHub Secrets!
# Запускается локально и пушит напрямую

set -e  # Exit on error

echo "🚀 Still Basing - Deploy to Root Domain"
echo "========================================"
echo ""

# Проверка что мы в правильной папке
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: запустите скрипт из папки StillBASING"
    exit 1
fi

# Проверка что node_modules существует
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Build приложения
echo "🔨 Сборка приложения..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: папка dist не создалась"
    exit 1
fi

echo "✅ Build успешен!"
echo ""

# Сохранить текущую директорию
SOURCE_DIR=$(pwd)

# Клонирование alubiama.github.io
TEMP_DIR=$(mktemp -d)
echo "📥 Клонирование alubiama.github.io..."

cd "$TEMP_DIR"
git clone https://github.com/Alubiama/alubiama.github.io.git

if [ ! -d "alubiama.github.io" ]; then
    echo "❌ Ошибка: не удалось клонировать репозиторий"
    echo "   Проверьте что репозиторий существует и доступен"
    exit 1
fi

cd alubiama.github.io

# Удаление старых файлов (кроме .git и README)
echo "🧹 Очистка старых файлов..."
find . -maxdepth 1 ! -name '.git' ! -name 'README.md' ! -name '.' ! -name '..' -exec rm -rf {} +

# Копирование новых файлов из dist
echo "📋 Копирование новых файлов..."
cp -r "$SOURCE_DIR/dist/"* .

# Проверка что файлы скопировались
if [ ! -f "index.html" ]; then
    echo "❌ Ошибка: файлы не скопировались"
    exit 1
fi

echo "✅ Файлы скопированы"
echo ""

# Git commit
echo "💾 Создание коммита..."
git add .

# Получить короткий хеш последнего коммита из StillBASING
cd "$SOURCE_DIR"
COMMIT_HASH=$(git rev-parse --short HEAD)
cd "$TEMP_DIR/alubiama.github.io"

git commit -m "Deploy from StillBASING @${COMMIT_HASH}

Includes Base SDK integration and all assets.
Auto-deployed via deploy-to-root.sh script." || {
    echo "ℹ️  Нет изменений для коммита"
}

# Push
echo "📤 Push в GitHub..."
echo ""
echo "⚠️  ВНИМАНИЕ: Сейчас откроется prompt для GitHub авторизации"
echo "   Введите ваш username и Personal Access Token"
echo ""

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ УСПЕШНО! Deployment завершен!"
    echo ""
    echo "📊 Результат:"
    echo "   - Репозиторий: https://github.com/Alubiama/alubiama.github.io"
    echo "   - Сайт: https://alubiama.github.io/"
    echo ""
    echo "⏱️  Подождите 2-3 минуты для GitHub Pages deployment"
    echo ""
    echo "🎯 Следующие шаги:"
    echo "   1. Откройте: https://alubiama.github.io/"
    echo "   2. Проверьте Console (F12) - должно быть 'Base SDK initialized'"
    echo "   3. Откройте в Base Dashboard"
    echo "   4. Ошибка 'Ready not called' должна исчезнуть!"
    echo ""
else
    echo ""
    echo "❌ Ошибка при push"
    echo ""
    echo "💡 Возможные причины:"
    echo "   1. Нет прав доступа к репозиторию"
    echo "   2. Неправильный токен"
    echo "   3. Репозиторий не существует"
    echo ""
    echo "🔧 Решение:"
    echo "   Создайте Personal Access Token:"
    echo "   https://github.com/settings/tokens"
    echo "   С permission: repo"
    echo ""
fi

# Cleanup
cd "$SOURCE_DIR"
rm -rf "$TEMP_DIR"
