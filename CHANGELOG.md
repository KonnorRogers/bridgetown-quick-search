# Changelog

## 3.9.1 - 05/25/2024

- dependencies: update to `ninja-keys@1.3.1`

## 3.9.0 - 05/25/2024

- feat: add `content`.
- fix: No longer always use `"*"` for alwaysShowResults, it has significant slow downs.
- dependencies: update to `ninja-keys@1.3.0`

## 3.8.0

- feat: Allow different endpoints via `endpoint` attribute
- feat: Always show results if no query given.
- feat: Set `snippet-length` and `always-show-results` as attributes

## 3.7.0

- dependencies: update konnors-ninjas, lit, lunr

## 3.6.0

- feat: defer creating elements until ninja-keys is opened.

## 3.3.0

- feat: add a `transformResult` hook for transforming returned content in ninja-keys.
- feat: add `collection` object in returned results

## 3.2.1

- fix: upgrade ninja-keys


## 3.2.0

- feat: add ninja keys integration

## 3.1.0

- Feat: Add additional parts for styling as well as a slot box-sizing reset.

## 3.0.3

- Fix: check if elements are defined before calling
`window.customElements.define()`

## 3.0.0

Modernize the workflow. Remove decorators, update
entrypoints, remove exportmaps, etc.

## 2.0.0 / 2022-10-08

* Upgrade to new initializer system for Bridgetown 1.2

## 1.1.2 / 2021-10-11

* Upgrade to newer Lit
* Switch from `site.pages` to `site.generated_pages` due to Bridgetown 1.0 API change

## 1.1.1 / 2021-07-18

* Allow for styling of links

## 1.1.0 / 2021-06-04

* Support the Resource content engine in Bridgetown 0.20+

## 1.0.5 / 2020-11-05

* Add `template_engine: liquid` to the JSON index so it plays well with Bridgetown 0.18+

## 1.0.0 / 2020-05-29

* DOCS COMING
