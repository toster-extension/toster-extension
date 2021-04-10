import { Component, Vue } from 'vue-property-decorator';
import SocialSharing from 'vue-social-sharing';
import { CHAT_URL, EXTENSION_URL, FEEDBACK_URL } from '@/libs/constants';

Vue.use(SocialSharing);

@Component
export default class Social extends Vue {
  get extensionUrl (): string {
    return EXTENSION_URL;
  }

  get extensionName (): string {
    return this.$i18n('extension_name');
  }

  get extensionDescription (): string {
    return this.$i18n('extension_description');
  }

  get overriddenNetworks () {
    return {
      review: {
        sharer: FEEDBACK_URL,
        type: 'direct',
      },
      chat: {
        sharer: CHAT_URL,
        type: 'direct',
      },
      beerpay: {
        sharer: 'https://beerpay.io/yarkovaleksei/toster-extension',
        type: 'direct',
      },
    };
  }
}
