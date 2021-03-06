/// <reference path="../defs/lib.d.ts" />
/// <reference path="../defs/underscore.d.ts" />
/// <reference path="./lists.ts" />

import l = module("./lists");

// Sort on column key providing direction (asc, desc).
export interface SortInterface {
    key: string;
    direction: number;
}

export interface ForEachCallback {
    (value: Backbone.Model, index: number, array: any)
}

export class SortedCollection extends Backbone.Collection {

    // A setter interface only.
    set sortOrder(value: SortInterface) {
        // Init?
        this._sortOrder = (this._sortOrder) ? this._sortOrder : <SortInterface> {};

        // Is it different from the previous one?
        if (!_(this._sortOrder).isEqual(<any> value)) {
            // Set it, not by reference!
            for (var key in value) {
                if (typeof(value[key]) == 'object') throw 'Not cool!';
                this._sortOrder[key] = value[key];
            }

            // Build new each cache when you ask me nicely for it ;).
            this.eachCache = function() {
                // Now is a list!
                this.eachCache = (<l.List[]> this.models).sort((a: l.List, b: l.List) => {
                    // Get the keys.
                    var keyA = a[value.key],
                        keyB = b[value.key];

                    if (typeof(keyA) !== typeof(keyB)) {
                        throw 'Key value types do not match'
                    }

                    // Based on the type of the object...
                    switch (typeof(keyA)) {
                        case 'string':
                            return value.direction * keyA.localeCompare(keyB);
                        case 'number':
                            return value.direction * (keyA - keyB);
                        case 'object':
                            // Hope it is a Date.
                            if (keyA instanceof Date) {
                                return value.direction * (+keyA - +keyB);
                            }
                        default:
                            throw 'Do not know how to sort on key `' + value.key + '`';
                    }
                });
            }
        }
    }

    private eachCache: any; // caches the results of a sort for this sort order (or is a fn, I don't know)
    private _sortOrder: SortInterface; // privately stored here

    // Use custom sort column and order on standard `each`.
    forEach(cb: ForEachCallback): void {
        // Need to exec it first? Sync.
        if (typeof(this.eachCache) == 'function') (<Function> this.eachCache)();

        // The callback is the same.
        (<Backbone.Model[]> this.eachCache).forEach(function(
            model: Backbone.Model, index: number, array: Backbone.Model[]
        ) {
            cb(model, index, array);
        });
    }

    // Make sure we do not sort.
    add(obj: any, opts?: any): void {
        if (!opts) {
            opts = { sort: false };
        } else {
            opts.sort = false;
        }
        Backbone.Collection['prototype'].add.call(this, obj, opts);
    }

    // Sort and return JSONified.
    toJSON(): any[] {
        var out = [];
        this.forEach(function(model: Backbone.Model) {
            out.push(model.toJSON());
        });
        return out;
    }

}