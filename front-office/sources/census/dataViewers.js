window.census = window.census || {};

// configure table formatter for strings that are actually numbers :) so that
// we can have a proper sorting in the table
$.tablesorter.addParser({
  id: 'thousands',
  is: function(s) {
    return false;
  },
  format: function(s) {
    return s.replace('$', '').replace(/,/g, '');
  },
  type: 'numeric'
});

Handlebars.registerHelper('array', function(array, index) {
  return array[index];
});

Handlebars.registerHelper('logaray', function(array, index) {
  return 16 * Math.log(array[index] + 1);
});

Handlebars.registerHelper('ratio', function(length) {
  return 100 / length;
});

Handlebars.registerHelper('format', function(number, format) {
  if (!number && number !== 0) {
    return '-';
  }
  if (isNaN(number)) {
    return number;
  }
  if (format) {
    return numeral(number).format(format);
  }
  return numeral(number).format('0');
});

var DataModel = Backbone.Model.extend({
  url: function() {
    return this.get('href');
  },
  average: function() {
    data = this.get('data');
    for (var i = 0; i < data.length; i++) {
      var ages = data[i].ages;
      var length = ages.length;
      var average = 0;
      for (var j = 0; j < length; j++) {
        average += ages[j];
      }
      if (length === 0) {
        data[i].average = 'n/a';
      } else {
        data[i].average = average / length;
      }
    }
    data.sort(function(a, b) {
      return b.ages.length - a.ages.length;
    });
  },
  prepareForTemplate: function() {
    // keeps the 100 with highest amount of contributors, then provide some summary for the remaining items
    var results, remaining, extra;
    results = this.toJSON();
    results.data = _.first(this.get('data'), 100);
    remaining = _.rest(this.get('data'), 100);
    if (remaining.length > 0) {
      extra = {
        values: 0,
        count: 0
      };
      for (var i = 0; i < remaining.length; i++) {
        extra.values++;
        extra.count += remaining[i].ages.length;
      }
      results.extra = extra;
    }
    return results;
  }
});


var DataViewer = Backbone.View.extend({
  template: Handlebars.compile('<h2>Repartition of age per {{name}}</h2>' +
    '{{#if extra}}<p>The following table does not include <b>{{extra.values}}</b> values representing <b>{{format extra.count "0,000"}}</b> people.{{/if}}' +
    '<div class="table-container"><table><thead>' +
    '<tr><th class="left">Value</th><th class="right">Count</th><th class="right">Average</th></tr>' +
    '</thead><tbody>' +
    '{{#each data}}<tr data-id="{{value}}">' +
    '<td class="left">{{value}}</td>' +
    '<td class="right">{{format ages.length "0,000"}}</td>' +
    '<td class="right" title="average of {{format average "0.00"}} years old">{{format average "0"}}</td>' +
    '</tr>{{/each}}' +
    '</tbody></table></div><div class="graph-container"></div>'),
  events: {
    'click tbody tr': 'selectRow'
  },
  selectRow: function(event) {},
  render: function() {
    var that = this;
    that.model.average();
    that.$el.html(that.template(that.model.prepareForTemplate()));
    that.$el.find('table').tablesorter({
      headers: {
        '1': {
          sorter: 'thousands'
        }
      }
    });

  }
});

window.census.dataViewers = {
  DataModel: DataModel,
  DataViewer: DataViewer
};
