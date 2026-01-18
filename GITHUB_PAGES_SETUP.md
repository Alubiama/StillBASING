# Инструкция по активации GitHub Pages

## Шаги для активации:

1. Откройте https://github.com/Alubiama/StillBASING/settings/pages

2. В разделе **"Build and deployment"**:
   - **Source**: выберите "GitHub Actions"

3. Сохраните настройки

4. Подождите 1-2 минуты пока произойдет деплой

5. Ваше приложение будет доступно по адресу:
   https://alubiama.github.io/StillBASING/

## Если страница не открывается:

1. Проверьте что в настройках Pages выбрано "GitHub Actions"
2. Зайдите в https://github.com/Alubiama/StillBASING/actions
3. Найдите последний workflow run и кликните на него
4. Проверьте что оба jobs (build и deploy) успешно выполнены (зеленая галочка)

## Примечание:

Workflow уже настроен и будет автоматически деплоить при каждом push в main branch.
Но GitHub Pages нужно активировать вручную **один раз** в настройках репозитория.
