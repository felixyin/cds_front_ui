export const normalizeMap = map => (
    Array.isArray(map)
        ? map.map(key => ({key, val: key}))
        : Object.keys(map).map(key => ({key, val: map[key]}))
);

export const normalizeNamespace = func =>
    (namespace, map) => {
        if (typeof namespace !== 'string') {
            map = namespace;
            namespace = '';
        }

        return func(namespace, map);
    };

export const mapModel = normalizeNamespace((namespace, models) => {
    const res = {};

    normalizeMap(models).forEach(({key, val}) => {
        res[key] = {
            get() {
                if (!namespace) {
                    const globalState = this.$store.state;

                    if (typeof val === 'function') return val(globalState);
                    return globalState[key];
                }

                const moduleState = namespace.split('/')
                    .reduce((prev, cur) => prev[cur], this.$store.state);

                if (typeof val === 'function') return val(moduleState);
                return moduleState[key];
            },
            set(value) {
                const type = !namespace ? 'updateModel' : `${namespace.split('/').join('/')}/updateModel`;

                const valify = String(val);
                let li = valify.indexOf('}');
                try {
                    if (global.__isdev){ // electron生产环境与开发环境有区别，此处生产环境不能修改store，需特殊处理。
                        li = valify.indexOf(';');
                    }
                } catch (e) {
                }
                const originState = valify.substring(valify.indexOf('.') + 1, li);

                this.$store.commit(type, {label: originState || key, value});
            },
        };
    });

    return res;
});

export const updateModel = () => ({
    updateModel(state, {label, value}) {
        if (label.includes('.')) {
            const labelKeys = label.split('.');

            for (let i = 0; i < labelKeys.length - 1; i += 1) {
                state = state[labelKeys[i]];
            }

            state[labelKeys[labelKeys.length - 1]] = value;
        } else {
            state[label] = value;
        }
    },
});
