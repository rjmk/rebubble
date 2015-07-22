function handleMaker(selector){
  return function(self, event){
    var trigger = rebubble.handy.call(this, selector, self, event);
    document.getElementById('click').innerHTML = trigger.className;
  };
}

var blogHandle = handleMaker('#content div.blog-title');

document.getElementsByClassName('blog-content')[0].onclick = handleMaker('div.coooool#great.fun');

document.getElementById('footer').onclick = handleMaker('');

document.getElementsByClassName('nav-bar')[0].onclick = function(event){
  var target = rebubble('li', this, event);
  var parent = target.parentNode;
  parent.removeChild(target);
  setTimeout(function(){parent.appendChild(target);}, 0);
};

test('clicking on the blog title puts "blog-title" in the click div', function(){
  document.getElementById('title').click();
  equal(document.getElementById('click').innerHTML, "blog-title");
});

test('clicking on the blue span deletes the whole "li"', function(assert){
  var done = assert.async();
  document.getElementsByClassName('blue')[0].click();
  notEqual(document.getElementsByClassName('nav-bar')[0].getElementsByTagName('li').length, 3);
  done();
});

test('clicking on the image puts "undefined" in the click div', function(){
  document.getElementsByTagName('img')[0].click();
  equal(document.getElementById('click').innerHTML, "undefined");
});

test('the empty selector works (returns the click target)', function(){
  document.getElementById('clicksy').click();
  equal(document.getElementById('click').innerHTML, "click-clack");
});

test('clicking on the blog-content div puts "undefined" in the click div', function(){
  document.getElementsByClassName('blog-content')[0].click();
  equal(document.getElementById('click').innerHTML, "undefined");
});
