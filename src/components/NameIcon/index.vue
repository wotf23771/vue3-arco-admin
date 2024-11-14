<script>
import { h, resolveDynamicComponent } from "vue";

function Icon(props, ctx) {
  const component = resolveDynamicComponent(`${props.icon}`);
  return h(component);
}

export default Icon;
</script>
