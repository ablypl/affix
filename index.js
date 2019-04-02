import AAffix from './src/AAffix';

export { AAffix };

export default {
    install(Vue, options = {}){
        return Vue.component(AAffix.name, AAffix);
    }
};

