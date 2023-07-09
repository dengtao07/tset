import Vue from 'vue';
Vue.directive('preventReClick',{
    bind(el,binding) {
        const time = typeof binding.value === 'number' ? binding.value : 3000;
        el.addEventListener('click',function(){
            if(this.disabled)
                return false;
            el.disabled =true;
            setTimeout(() => {
                el.disabled = false;
            },time);
        })
    }
})