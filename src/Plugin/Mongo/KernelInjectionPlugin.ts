import * as mongoose from "mongoose";

export default (kernel) => {
    function KernelInjectionPlugin(schema, options) {
        schema.post('init', function (doc) {
            doc.kernel = kernel;
        });
    }

    mongoose.plugin(KernelInjectionPlugin);
}