const summary = require('../output/summary.json');
const InspectController = require('./InspectController');

module.exports = ReportController = function ReportController() {
  // const reportItems = summary.slice(0, 10); // Limit to first 10 items for testing
  const reportItems = summary; // Use the entire summary for the report
  const report = {
    totalGuides: reportItems.length,
    totalEntries: 0,
    items: [],
  };
  reportItems.forEach((entry) => {
    let { item, results } = InspectController(entry.id);
    results.forEach((page) => {
      if (page.kwic && page.kwic.length > 0) {
        page.kwic[0].forEach((kwicResult) => {
          // console.log(kwicResult);
          report.items.push({
            id: item.id,
            guide_title: item.name,
            type: item.type_label,
            main_url: item.url,
            updated: item.updated,
            owner_name: item.owner_name,
            owner_email: item.owner_email,
            keyword: kwicResult.keyword,
            page_url: page.url,
            context: `${kwicResult.pre}${kwicResult.keyword}${kwicResult.post}`,
          });
        });
      }
    });
  });
  report.totalEntries = report.items.length;
  return report;
};
