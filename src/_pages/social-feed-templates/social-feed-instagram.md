---
permalink: /social-feed-instagram/
---

{% raw %}
<div class="block-grid-item">
    <a href="{{=it.link}}" target="blank" class="btn-tile is-static social-feed-element {{? !it.moderation_passed}} hidden{{?}}" dt-create="{{=it.dt_create}}" social-feed-id="{{=it.id}}">
        <span class="btn-tile-bg" style="background-image: url({{=it.attachment_url}})"></span>
        <img width="100%" src="/assets/img/layout/placeholder-instagram.png">
    </a>
</div>
{% endraw %}