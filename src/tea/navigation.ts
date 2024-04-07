import * as Effect from './effect';
import * as Subscription from './subscription';

// Nav Types

type Internal = { type: 'UrlRequest.Internal'; url: string };
type External = { type: 'UrlRequest.External'; url: string };
export type UrlRequest = Internal | External;

// Guards

export function isInternal(value: UrlRequest): value is Internal {
  return value.type === 'UrlRequest.Internal';
}

export function isExternal(value: UrlRequest): value is External {
  return value.type === 'UrlRequest.External';
}

// Nav Effect types

export type Effects =
  | Effect.Eff<'NavPushUrl', string>
  | Effect.Eff<'NavLoad', string>;

// Nav Effect type constructors

export const eff: Effect.EffRecord<Effects> = {
  NavPushUrl: (url) => Effect.eff('NavPushUrl', url),
  NavLoad: (url) => Effect.eff('NavLoad', url),
};

// Nav Effect functions

export function pushUrl<Msg>(url: string): Effect.EffectFn<Msg> {
  return (done) => {
    history.pushState({}, '', url);
    done.withoutMessage();
    return { dispose: () => {} };
  };
}

export function load<Msg>(url: string): Effect.EffectFn<Msg> {
  return (done) => {
    done.withoutMessage();
    window.location.href = url;
    return { dispose: () => {} };
  };
}

// Nav Subscriptions

export function subscriptions<Msg>(
  linkClickedMsg: (urlRequest: UrlRequest) => Msg,
  urlChangedMsg: (url: string) => Msg,
): Subscription.Sub<Msg> {
  return {
    NavSubscriptions: function (send) {
      // Intercept browser URL changes
      window.addEventListener('popstate', (event) => {
        event.preventDefault();
        send(urlChangedMsg(window.location.href));
      });

      // Listen to link clicks
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const link = target.closest('a[href]');
        if (
          link &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          event.button < 1 &&
          !link.hasAttribute('download')
        ) {
          event.preventDefault();
          const curr = new URL(window.location.href!);
          const next = new URL(
            link.getAttribute('href')!,
            window.location.origin,
          );

          if (next.toString() === curr.toString()) {
            return;
          }

          if (
            next &&
            curr.protocol === next.protocol &&
            curr.host === next.host &&
            curr.port === next.port
          ) {
            send(
              linkClickedMsg({ type: 'UrlRequest.Internal', url: next.href }),
            );
          } else {
            send(
              linkClickedMsg({ type: 'UrlRequest.External', url: next.href }),
            );
          }
        }
      });

      return {
        dispose: () => {},
      };
    },
  };
}
