/// <reference path="../defs/lib.d.ts" />

import s = module("./sort");

export interface TagInterface {
    name: string; // tag name, not using internal id!
    count: number; // how many times used
    active: bool; // actively selected in UI?
    rgb: number[]; // colorized string
}

// One tag.
export class Tag extends Backbone.Model implements TagInterface {

    get name(): string       { return this.get('name'); }
    set name(value: string)  { this.set('name', value); }
    set count(value: number) { this.set('count', value); }
    get count(): number      { return this.get('count'); }
    set active(value: bool)  { this.set('active', value); }
    get active(): bool       { return this.get('active'); }
    set rgb(value: number[]) { this.set('rgb', value); }
    get rgb(): number[]      { return this.get('rgb'); }

    constructor(obj: TagInterface) {
        super();

        // Set the name from the incoming object.
        this.name = obj.name;

        // Say you are active.
        this.active = true;

        // Init count.
        this.count = 1;

        // Colorize.
        this.rgb = Tag.colorize(obj.name);
    }

    // Boost JSONification with our internal id.
    public toJSON(): any {
        // noinspection JSUnresolvedVariable
        return _.extend(Backbone.Model.prototype.toJSON.call(this), { id: this.cid });
    }

    // Return a color for a string.
    private static colorize(text: string): number[] {
        var hash = md5(text);
        return [
            parseInt(hash.slice(0, 2), 16),
            parseInt(hash.slice(1, 3), 16),
            parseInt(hash.slice(2, 4), 16)
        ];
    }

}

// All the tags, coming from Lists.
export class Tags extends s.SortedCollection {

    model: Tag;

    initialize() {
        // By default sort on the count of lists with our tag.
        this.sortOrder = { key: 'count', direction: 1 };
    }

    // Add a new tag or increase count.
    add(obj: any): Tag {
        // Do we have it?
        var tag: Tag;
        if (tag = <Tag> this.find(function(item: Tag) {
            return item.name == obj.name;
        })) {
            tag.count += 1;
        } else {
            tag = new Tag(obj);
            // noinspection JSUnresolvedVariable
            s.SortedCollection.prototype.add.call(this, tag);
            // Backbone.Collection.prototype.add.call(this, tag, { sort: false });
        }

        return tag;
    }

    // Filter the Models to active ones.
    getActive(): any {
        return _(this.filter(function(tag: Tag): bool {
            return tag.active;
        }));
    }

    // Quick access for _.every on a property.
    every(property: string, all: bool): bool {
        return <bool> _(this.models).every(function(tag: Tag): bool {
            return tag[property] === all;
        });
    }

    // Set all properties in our models to a particular value (silently).
    setAll(property: string, value: any): void {
        // The new.
        var obj: any = {};
        obj[property] = value;
        // Change switch.
        var changed: bool = false;
        // For all.
        this.forEach(function(tag: Tag) {
            if (changed || tag[property] !== value) {
                changed = true;
                tag.set(obj, { silent: true });
            }
        });
        // Trigger the event once?
        if (changed) this.trigger('change');
    }

}

// Globally available.
export var tags = new Tags();