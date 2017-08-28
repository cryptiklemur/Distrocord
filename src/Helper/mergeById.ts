import {Long} from "bson";

export default function mergeById(first, second) {
    const newArray = [];

    first.forEach((x) => {
        second.forEach((y) => {
            if (matches(x, y)) {
                newArray.push(first);
            }
        });
    });

    return newArray;
}

interface MatchTypeInterface {
    identifier?: string;
    id?: Long | string;
    user?: string;
}

function matches(x: MatchTypeInterface, y: MatchTypeInterface) {
    if (y.id || x.id) {
        if (y.id instanceof Long) {
            if (x.id instanceof Long) {
                return x.id.equals(y.id);
            }

            return y.id.toString().equals(x.id);
        }
        if (x instanceof Long) {
            return x.id.toString().equals(y.id);
        }

        return y.id.equals(x.id as string);
    }

    if (y.user || x.user) {
        return y.user === x.user;
    }

    return false;
}
