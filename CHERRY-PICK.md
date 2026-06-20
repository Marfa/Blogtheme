# Cherry-pick: Joben 2.14 → Blogtheme 2.15

Источник: `/Users/konstantiedokucaev/Downloads/joben`  
Цель: перенести полезные изменения upstream, **не затрагивая** кастомизации блога.

---

## ✅ Применено

| # | Файл | Из Joben | Адаптация под Blogtheme |
|---|------|----------|-------------------------|
| 1 | `package.json` | Настройка `post_card_tag_accent_bg` | Без изменений |
| 2 | `index.hbs` | `data-grid-color` на `.post-container` | Сохранены баннеры и русские тексты |
| 3 | `author.hbs`, `page-authors.hbs` | Блок соцсетей автора | **Без Facebook и Instagram**; русская подпись к сайту |
| 4 | `partials/post-card.hbs` | Badge `visibility` на карточках | Без изменений |
| 5 | `custom-with-sidebar.hbs` | Чистая структура шаблона | Убран дублирующий `post-hero` и вложенный `container` |

---

## ❌ Отменено по запросу

| # | Файл | Причина |
|---|------|---------|
| 6 | `default.hbs` | Блок подписки для гостей — не нужен |
| 7 | `partials/header.hbs` | Sign In / Sign Up / Upgrade через Portal — не нужно |
| 8 | `partials/user-menu.hbs` | Upgrade и Portal signup/signin — не нужно |
| 9 | `index.hbs` | Кнопка Upgrade в hero через Portal — не нужно |

---

## ⏸ Рекомендуется вручную (по необходимости)

| # | Файл | Что даёт | Почему не автоматически |
|---|------|----------|-------------------------|
| 10 | `partials/footer.hbs` | `{{> social-media}}` в футере | Сейчас соцсети убраны намеренно |
| 11 | `partials/social-share.hbs` | Нативные кнопки шаринга Ghost | Конфликт с uSocial в `post.hbs` |
| 12 | `index.hbs` | Секция «Наши друзья» (SEO-ссылки) | Закомментирована; включать только при необходимости |
| 13 | `default.hbs` | `<meta name="ghost-theme" content="Joben …">` | Не нужно для production-блога |

---

## ❌ Не переносить

| Область | Причина |
|---------|---------|
| Английский `locales/en.json` | Сайт на русском |
| Ghost Comments вместо FastComments | Своя система комментариев |
| uSocial → `social-share` | Своя интеграция шаринга |
| Удаление баннеров PST / Luxup / Clickio | Монетизация блога |
| `ads.txt`, `robots.txt`, `rss.hbs`, `custom-noad.hbs`, `textru.txt` | Уникальные файлы Blogtheme |
| CC-футер → «Published with Ghost» | Свой юридический блок |
| `engines: ghost >=5` | Blogtheme на Ghost 6 |
| Полная замена шаблонов post/tag/custom | Потеря кастомной вёрстки и рекламы |

---

## Проверка после cherry-pick

```bash
npm run test    # gscan
npm run build   # gulp build
```

В Ghost Admin → Design → Theme settings: включить **Post card tag accent background**, если нужен цветной фон карточек по тегам.

---

## Откат

```bash
git checkout HEAD -- package.json index.hbs author.hbs page-authors.hbs default.hbs \
  partials/post-card.hbs partials/header.hbs partials/user-menu.hbs \
  custom-with-sidebar.hbs
```
