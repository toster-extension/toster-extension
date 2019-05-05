<template>
  <social-sharing :url="extensionUrl"
                  :title="extensionName"
                  :description="extensionDescription"
                  :quote="extensionDescription"
                  :networks="overriddenNetworks"
                  hashtags="toster,toster-extension"
                  twitter-user="yarkov_aleksey"
                  network-tag="a"
                  inline-template>
    <div class="social">
      <network network="review">
        <img src="./icons/review.svg"
             :title="$i18n('contextMenuFeedback')" />
      </network>
      <network network="chat">
        <img src="./icons/chat.svg"
             :title="$i18n('contextMenuSendPM')" />
      </network>
      <network network="facebook">
        <img src="./icons/facebook.svg"
             title="Facebook" />
      </network>
      <network network="linkedin">
        <img src="./icons/linkedin.svg"
             title="LinkedIn" />
      </network>
      <network network="pinterest">
        <img src="./icons/pinterest.svg"
             title="Pinterest" />
      </network>
      <network network="twitter">
        <img src="./icons/twitter.svg"
             title="Twitter" />
      </network>
      <network network="vk">
        <img src="./icons/vk.svg"
             title="VK" />
      </network>
      <network network="beerpay">
        <img src="./icons/beerpay.svg"
             title="Donate" />
      </network>
    </div>
  </social-sharing>
</template>

<script lang="ts" src="./script.ts"></script>

<style scoped>
.social {
    display: flex;
    flex-direction: row;
    padding-top: 15px;
}

.social >>> a > img {
    width: 48px;
    margin-bottom: 5px;
    cursor: pointer;
}

@media (min-width: 1024px) {
    .social {
        flex-direction: column;
        position: fixed;
        top: 50%;
        right: 0;
        transform: translate(-50%, -50%);
    }
}
</style>
