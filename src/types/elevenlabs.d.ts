import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'agent-id': string;
          'variant'?: 'full' | 'compact';
          'expandable'?: 'never' | 'mobile' | 'desktop' | 'always';
          'avatar-image-url'?: string;
          'avatar-orb-color-1'?: string;
          'avatar-orb-color-2'?: string;
          'action-text'?: string;
          'start-call-text'?: string;
          'end-call-text'?: string;
          'expand-text'?: string;
          'listening-text'?: string;
          'speaking-text'?: string;
          'language'?: string;
          'server-location'?: string;
        },
        HTMLElement
      >;
    }
  }
}
