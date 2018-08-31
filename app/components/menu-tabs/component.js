import { isEmpty } from '@ember/utils';
import { observer, computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import Component from '@ember/component';

import _ from 'lodash';
/* eslint-disable no-console */
export default Component.extend({
    breakdowns: A([]),
    selected: null,
    items: null,
    menuTree: Object.freeze([]),

    jobs: service(),

    paramsDidChange: observer('typeParam', 'stateParam', 'menuTree', 'menuTree.[]', function(){
        this.updateActiveState();
    }),

    jobStates: computed('stats', 'stats.[]', function() {
        var states = A(this.get('jobs.STATES'));
        var stats = this.stats;

        if(isEmpty(stats)) {
          return;
        }

        return states.map(function(state) {
            return {
                state: state,
                count: stats[state+'Count']
            };
        });
    }),

    breakdownsDidLoad: observer('breakdowns', 'breakdowns.[]', function() {
        var breakdowns = this.breakdowns;
        var byType = _.groupBy(breakdowns, 'type');
        var menu = [];

        for(var type in byType) {
            var subItems = byType[type];
            menu.push({
                type: type,
                count: this.computeTotal(subItems),
                subItems: subItems
            });
        }
        this.set('menuTree', menu);
    }),

    computeTotal(arr) {
        return arr.reduce((acc, obj) => obj.count + acc, 0);
    },

    updateActiveState() {
        var selected = {
            state: this.stateParam,
            type: this.typeParam,
        };
        var items = this.menuTree;

        items.forEach(item => {
            set(item, 'active', item.type === selected.type);
            item.subItems.forEach(sub => {
                set(sub, 'active',  sub.state === selected.state && sub.type === selected.type);
                set(sub, 'hide', !item.active);
            });
            return item;
        });


        this.set('items', items);
    },

    actions: {
        goToItem(item) {
          // eslint-disable-next-line ember/closure-actions
            this.sendAction("action", item);
        },

    }
});
