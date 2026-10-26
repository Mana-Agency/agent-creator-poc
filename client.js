/**
 * Greeting — dynamic Client half.
 *
 * Prints one line in Settings → General: "What would you like to do today?"
 *
 * This is the smallest useful DSH client plugin: it registers a single row in a
 * slot the host already provides, with no services, no persistence, and no
 * configuration. Every other plugin in this workspace started life as a row
 * like this one and grew from there.
 *
 * The Host half (index.js) is intentionally inert.
 */
window.__ModuleLoader__.load({
  id: '@mana-agency/agent-creator-poc',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owning this row's copy. */
    const NS = 'settings.agent-creator-poc';

    /** The exact line this plugin prints. */
    const GREETING = 'What would you like to do today?';

    /** Fallback copy, used when the locale service has no dictionary loaded. */
    const FALLBACK = {
      'greeting.title': 'Getting started',
      'greeting.text': GREETING,
    };

    /**
     * Locale dictionaries. The key set is identical across languages; only the
     * values change. Keep GREETING verbatim in English so the printed line is
     * byte-identical whatever the UI language is.
     */
    const DICTS = {
      en: FALLBACK,
      zh: {
        'greeting.title': '开始使用',
        'greeting.text': GREETING,
      },
    };

    /**
     * Row styles. The row/typography pattern mirrors the host's own General
     * settings rows (same border, spacing, type sizes, and token references),
     * renamed under an `acp_` prefix so it cannot collide with another plugin.
     */
    const CSS = [
      '.acp_row{box-sizing:border-box;display:flex;align-items:center;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}',
      '.acp_text{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0;padding-right:24px}',
      '.acp_title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}',
      '.acp_greeting{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:500;line-height:24px}',
    ].join('');

    /** One preference row: a small label and the printed greeting line. */
    function GreetingRow({ t }) {
      const translate = typeof t === 'function' ? t : (key) => FALLBACK[key] || key;
      return h(
        'div',
        { className: 'acp_row' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'acp_text' },
          h('div', { className: 'acp_title' }, translate('greeting.title')),
          h('div', { className: 'acp_greeting' }, translate('greeting.text')),
        ),
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, 'en', DICTS.en),
          'agent-creator-poc: en dictionary',
        );
        ctx.effect(
          () => ctx.locale.register(NS, 'zh', DICTS.zh),
          'agent-creator-poc: zh dictionary',
        );

        // The General section supplies no props: the row draws its own internals.
        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            {
              name: 'settings.general.item',
              id: 'agent-creator-poc',
              order: 12,
              locale: NS,
            },
            GreetingRow,
          ),
        );
      },
    };
  },
});

