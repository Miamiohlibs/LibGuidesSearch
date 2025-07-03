function buildStatusFilter() {
  var items = [],
    options = [];

  // // Find the index of the "Type" column in the table header
  const typeArrayIndex = $('#myTable thead tr th:contains("Type")').index();
  const typeSelectorIndex = typeArrayIndex + 1; // Adjust for 1-based index in nth-child

  //Iterate all td's in third column
  $(`#myTable tbody tr td:nth-child(${typeSelectorIndex})`).each(function () {
    //add item to array
    items.push($(this).text());
  });
  // console.log('initial items: ' + items.length);

  items = [...new Set(items.sort())];
  //restrict array to unique items
  // var items = $.unique( items );
  // var items = [new Set(...items)].flat();
  // console.log('unique items: ' + items.length);

  //iterate unique array and build array of select options
  $.each(items, function (i, item) {
    let itemTag = item.replace(/ /g, '-');

    options.push(
      '<div class="form-check form-check-inline">' +
        '<input class="form-check-input" type="checkbox" id="statuses-' +
        itemTag +
        '" name="' +
        itemTag +
        '" value="' +
        item +
        '" checked> ' +
        '<label class="form-check-label" for="statuses-' +
        itemTag +
        '">' +
        item +
        '</label>' +
        '</div>'
    );
  });

  //finally empty the select and append the items from the array
  $('#selectType').empty().append(options.join(''));
  //   console.log(options);
}

// modeled on: https://live.datatables.net/nelujavu/51/edit
$.fn.dataTable.ext.search.push(function (
  settings,
  searchData,
  index,
  rowData,
  counter
) {
  // // Find the index of the "Type" column in the table header
  const typeArrayIndex = $('#myTable thead tr th:contains("Type")').index();
  const typeSelectorIndex = typeArrayIndex + 1; // Adjust for 1-based index in nth-child

  var selectedStatuses = [];
  $('#selectType input:checked').each(function () {
    selectedStatuses.push($(this).val());
  });
  if (selectedStatuses.length > 0) {
    // Check if the row's type is in the selected statuses
    if (selectedStatuses.includes(rowData[typeArrayIndex])) {
      return true; // Include this row in the results
    }
  }
  return false;
});
