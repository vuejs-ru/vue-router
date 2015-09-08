import { warn } from '../util'
import { activate } from '../pipeline'

export default function (Vue) {

  let _ = Vue.util
  let componentDef = Vue.directive('_component')
  // <router-view> extends the internal component directive
  let viewDef = _.extend({}, componentDef)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      let route = this.vm.$route
      /* istanbul ignore if */
      if (!route) {
        warn(
          '<router-view> can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      componentDef.bind.call(this)

      // does not support keep-alive.
      /* istanbul ignore if */
      if (this.keepAlive) {
        this.keepAlive = false
        warn('<router-view> does not support keep-alive.')
      }
      /* istanbul ignore if */
      if (this.waitForEvent) {
        this.waitForEvent = null
        warn(
          '<router-view> does not support wait-for. Use ' +
          'the acitvate route hook instead.'
        )
      }

      // all we need to do here is registering this view
      // in the router. actual component switching will be
      // managed by the pipeline.
      let router = this.router = route.router
      router._views.unshift(this)

      // note the views are in reverse order.
      let parentView = router._views[1]
      if (parentView) {
        // register self as a child of the parent view,
        // instead of activating now. This is so that the
        // child's activate hook is called after the
        // parent's has resolved.
        parentView.childView = this
      }

      // handle late-rendered view
      // two possibilities:
      // 1. root view rendered after transition has been
      //    validated;
      // 2. child view rendered after parent view has been
      //    activated.
      var transition = route.router._currentTransition
      if ((!parentView && transition.done) ||
          (parentView && parentView.activated)) {
        var depth = parentView ? parentView.depth + 1 : 0
        activate(this, transition, depth)
      }
    },

    unbind: function () {
      this.router._views.$remove(this)
      componentDef.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}
