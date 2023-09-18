---
title: Iterator
date: 2020/12/15
tags:
 - js
categories:
 - web
---

# Iterator

### 一、认识什么是迭代器

---

* 迭代器(iterator)，是确使用户可在容器对象(container，例如链表或数组)上遍访的对象，使用该接口无需关心对象的内部实现细节；这是维基百科中解释。

* 在迭代器的定义我们可以看出，迭代器是==帮助我们对某个数据结构进行遍历的对象==。

* 在JavaScript中，迭代器是一个对象，这个对象需要符合迭代器协议(iterator protocol)
  * 在js中iterator protocol这个标准就是一个特定的next方法

* next方法有如下的要求：

  * 一个无参数或者一个参数的函数，返回一个应当拥有以下两个属性的对象：
  * **done(boolean)**
    * 如果迭代器可以产生序列中的下一个值，则为false
    * 如果迭代器已将序列迭代完毕，则为true；这种情况下，value是可选的，如果它依然存在，即为迭代结束之后的默认返回值，也就是undefined

  * **value**
    * 迭代器返回的任何JavaScript值，done为true时可省略

```js
const nums = [10, 30, 40]

// 迭代器是一个对象，这个对象是要符合迭代器协议(iterator protocal)的
let index = 0
const numsiterator = {
  next: function() {
    if (index < nums.length) {
      return { done: false, value: nums[index++] }
    } else {
      return { done: true, value: undefined }
    }
  }
}

console.log(numsiterator.next()); // { done: false, value: 10 }
console.log(numsiterator.next()); // { done: false, value: 30 }
console.log(numsiterator.next()); // { done: false, value: 40 }
console.log(numsiterator.next()); // { done: true, value: undefined }
```

这只是nums的迭代器，那如果还有别的数组需要遍历，就还要在写一遍这样的代码，这样太麻烦了，所以就封装了生成迭代器的函数：

```js
// arr: 需要迭代的数组
function createArrIterator(arr) {
  let index = 0
  return {
    next: function() {
      if (index < arr.length) {
        return { done: false, value: arr[index++] }
      } else {
        return { done: true, value: undefined }
      }
    }
  }
}
```

### 二、认识什么是可迭代对象
---

* 上面我们封装的生成迭代器的代码整体来说看起来是有点奇怪的：
  * 我们获取一个数组的时候，需要自己创建一个index变量，再创建一个所谓的迭代器对象；
  * 事实上，我们可以对上面的代码进行进一步的封装，让其变成一个可迭代对象

* 什么又是可迭代对象呢？

  * 它和迭代器是完全不同的概念；

  * 当一个对象实现了**iterable** protocol协议时，那它就是一个可迭代对象；

  * 这个对象的要求是必须实现@@iterator方法，这意味着这个对象必须具有一个带**Symbol.iterator**键的属性

    ```js
    const iterableObj = {
      nums: [10, 30, 40],
      [Symbol.iterator]: function() {
        let index = 0
        return {
          next: () => {
            if (index < this.nums.length) {
              return { done: false, value: this.nums[index++] }
            } else {
              return { done: true, value: undefined }
            }
          }
        }
      }
    }
    
    const numsiterator = iterableObj[Symbol.iterator]()
    console.log(numsiterator.next()); // { done: false, value: 10 }
    console.log(numsiterator.next()); // { done: false, value: 30 }
    console.log(numsiterator.next()); // { done: false, value: 40 }
    console.log(numsiterator.next()); // { done: true, value: undefined }
    ```

### 三、内置可迭代对象
---

* String、Array、 Map、Set和arguments都是内置可迭代对象，因为它们的原型对象都拥有一个Symbol.iterator方法

  ```js
  const nums = [10, 30, 40]
  console.log(nums[Symbol.iterator]);
  const numsiterator = nums[Symbol.iterator]()
  console.log(numsiterator.next());
  console.log(numsiterator.next());
  console.log(numsiterator.next());
  console.log(numsiterator.next());
  
  const set = new Set()
  set.add(10)
  set.add(100)
  set.add(1000)
  const setIterator = set[Symbol.iterator]()
  console.log(setIterator.next());
  console.log(setIterator.next());
  console.log(setIterator.next());
  console.log(setIterator.next());
  console.log(setIterator.next());
  
  
  function foo(x, y, z) {
    const argusIterator = arguments[Symbol.iterator]()
    console.log(argusIterator.next());
    console.log(argusIterator.next());
    console.log(argusIterator.next());
    console.log(argusIterator.next());
  }
  
  foo(20, 30, 40)
  ```

### 四、可迭代对象的应用
---

* 一些语句和表达式专用于可迭代对象

  * javascript中语法：for...in、展开语法、yield*、解构赋值

  * 创建一些对象时：new Map([iterable])、new Set([iterable])

  * 一些方法的调用：Promise.all([iterable])

    ```js
    // 1、for...of
    const nums = [10, 20, 30]
    for(let num of nums) {
      console.log(num);
    }
    
    // 展开语法
    const nums1 = [...nums, 20]
    console.log(nums1);
    
    
    // 解构赋值
    const [num1, num2] = nums
    console.log(num1, num2);
    
    // 创建一些其他对象时
    const set = new Set(nums)
    console.log(set);
    
    // Promise.all
    Promise.all(nums).then(res => {
      console.log(res);
    })
    ```

### 五、自定义类的迭代

---

* 在前面我们看到Array、Set、String、Map等类创建出来的对象都是可迭代对象：
  * 在面向对象开发中，我们可以通过class定义一个自己的类，这个类可以创建很多的对象
  * 如果我们也希望自己的类创建出来的对象默认是可迭代的，那么在设计类的时候我们就额可以添加上@@iterator方法

* 案例：创建一个classroom的类

  * 教室中有自己的位置、名称、当前教室的学生；

  * 这个教室可以进来新学生

  * 创建的教师对象是可迭代对象

    ```js
    // 有的时候我们需要自己创建一个可以迭代的对象
    class classRoom {
      constructor(address, name, students) {
        this.address = address
        this.name = name
        this.students = students
      }
    
      entry(student) {
        this.students.push(student)
      }
    
      [Symbol.iterator]() {
        let index = 0
        return {
          next: () => {
            if (index < this.students.length) {
              return  { done: false, value: this.students[index++] }
            } else {
              return { done: true, value: undefined }
            }
          }
        }
      }
    }
    
    const stus = new classRoom('G205', '理科1班', ['kobe', 'why', 'curry', 'james'])
    stus.entry('lgm')
    const stuIterator = stus[Symbol.iterator]()
    // console.log(stuIterator.next());
    
    
    for (let stu of stus) {
      console.log(stu)
      if (stu === 'why') {
        break;
      }
    }
    ```

### 六、迭代器的中断

---

* 迭代器在某些情况下会在没有完全迭代的情况下中断：
  * 比如在遍历的过程中通过break、continue、return、throw中断了循环操作
  * 比如在解构的时候，没有解构所有的值

* 那么这个时候我们如果需要监听中断的话，就可以添加return方法

  ```js
  [Symbol.iterator]() {
      let index = 0
      return {
        next: () => {
          if (index < this.students.length) {
            return  { done: false, value: this.students[index++] }
          } else {
            return { done: true, value: undefined }
          }
        },
        // 迭代器的中断
        // 如果我们想要监听迭代器的中断，可以添加return方法
        return: () => {
          console.log('迭代终止了');
          return { done: true, value: undefined }
        }
      }
    }
  ```

# Generator

### 一、什么是生成器函数
---

* 生成器是ES6中新增的一种函数控制、使用的方案，它可以让我们更加灵活的控制函数什么时候继续执行、暂停执行等。
* 生成器函数也是一个函数，但是和普通的函数有一些区别：
  * 第一个区别：生成器函数需要在function的**后面**加一个符号：==*==
  * 第二个区别：生成器函数可以通过**yield**关键字来控制函数的执行流程
  * 第三个区别：生成器函数的返回值是Generator(生成器):
    * 生成器事实上是一种特殊的迭代器

```js
function* generator() {
  console.log('函数开始执行~');
  console.log('-------');

  const value1 =10
  console.log(value1);
  yield

  const value2 = 100
  console.log(value2);
  yield

  const value3 = 1000
  console.log(value3);
  yield

  console.log('------');
  console.log('函数执行完毕~');
}

foo() // 什么都没有
```

### 二、生成器函数执行
---

* 我们发现上面的生成器函数foo的执行体压根没有执行，它只是返回了一个生成器对象

  * 那么我们如何可以让它执行函数中的东西呢？调用next即可；

  * 调用next是有返回值的，而一般返回的是一个undefined，我们不希望next返回undefined的，这个时候我们可以通过yield来返回结果

    ```js
    // 当遇到yield就暂停执行函数
    // 当遇到return就停止执行函数
    
    function* generator() {
      console.log('函数开始执行~');
      console.log('-------');
    
      const value1 =10
      console.log(value1);
      yield value1
    
      const value2 = 100
      console.log(value2);
      yield value2
    
      const value3 = 1000
      console.log(value3);
      yield value3
    
      console.log('------');
      console.log('函数执行完毕~');
      return 10000
    }
    
    // 调用生成器函数返回的是一个生成器对象，而生成器本质上是一个迭代器
    const foo = generator()
    // 第一段代码的执行
    console.log(foo.next()); // 函数开始执行~ 、-------、 10、{ value: 10, done: false }
    // 第二段代码的执行
    console.log(foo.next()); // 100、{ value: 100, done: false }
    // 第三段代码的执行
    console.log(foo.next()); // 1000、{ value: 1000, done: false }
    // 执行剩余代码
    console.log(foo.next()); // ------ 、函数执行完毕~ 、{ value: 10000, done: true }
    ```

### 三、生成器函数传递参数 - next函数
---

* 函数既然可以暂停来分段执行，那么函数是可以给每个分段来传递参数的

* 我们在调用next函数的时候，可以给它传递参数，那么这个参数会作为上一个yield语句的返回值

  ```js
  function* foo(value) {
    console.log('函数开始执行');
  
    const num1 = 10
    const value1 = yield num1 * value // 这个value1是第二段代码传过来的参数
  
    const num2 = 20
    const value2 = yield num2 * value1
  
    const num3 = 30
    const value3 = yield 30 * value2
  
    console.log('函数结束执行');
    return value3
  }
  
  const generator = foo(5) // 第一段代码执行所需的参数
  // 第一段代码块执行
  console.log(generator.next());
  // 第二段代码
  console.log(generator.next(10));
  // 第三段代码
  console.log(generator.next(20));
  // 第四段代码
  console.log(generator.next(30));
  ```


### 四、生成器提前介绍 - return函数

---

* 含有一个可以给生成器函数传递参数的办法就是通过return 函数
  * 但是return函数传值后这个生成器函数就会结束，之后调用next不会继续产生值了

```js
function* foo(value) {
  console.log('函数开始执行');

  const num1 = 10
  const value1 = yield num1 * value // 这个value1是第二段代码传过来的参数

  const num2 = 20
  const value2 = yield num2 * value1

  const num3 = 30
  const value3 = yield 30 * value2

  console.log('函数结束执行');
  return value3
}

const generator = foo(5)

// 第一段代码开始执行
console.log(generator.next()); // 函数开始执行、{ value: 50, done: false }

// 第二段代码不执行了，相当于在第一段代码和第二段代码中间return了，
// 前面说过，return就是中止这个函数的执行，所以，后面的代码将不会执行了，也不会生成值了
console.log(generator.return(10000)); // { value: 10000, done: true }
```

### 五、生成器抛出异常 - throw函数
---

* 除了给生成器函数内部传递参数之外，也可以给生成器函数内部抛出异常：
  * 抛出异常后我们可以在生成器函数中捕获异常

```js
function* foo(value) {
  console.log('函数开始执行');

  try {
    const num1 = 10
    yield num1 * value // 这个value1是第二段代码传过来的参数
  } catch(err) {
    console.log(err);
    yield 'abc'
  }

  const num2 = 20
  console.log('num2执行');
  const value2 = yield num2
}

const generator = foo(5)
// 第一段代码
console.log(generator.next()); // 函数开始执行、{ value: 50, done: false }
// 第二段代码抛出异常
console.log(generator.throw('err message')); // err message、{ value: 'abc', done: false }
```

### 六、生成器替代迭代器
---

* 我们发现生成器是一种特殊的迭代器，那么在某些情况下我们可以使用生成器来替代迭代器

* 我们来用用三个案例，来体现生成器替代迭代器的好处

  * 第一个案例

    ```js
    function* createArrayIterator(arr) {
      let index = 0
      // 3、第三种方案
      yield* arr
    
      // 2、第二种方案
      // yield arr[index++]
      // yield arr[index++]
    
      // 1、第一种方案,这是迭代器的写法
      // return {
      //   next: function() {
      //     if (index < arr.length) {
      //       return { done: false, value: arr[index++] }
      //     } else {
      //       return { done: true, value: undefined }
      //     }
      //   }
      // }
    }
    
    const names = ['avb', 'fgd']
    const namesIterator = createArrayIterator(names)
    
    console.log(namesIterator.next()); // { value: 'avb', done: false }  
    console.log(namesIterator.next()); // { value: 'fgd', done: false }  
    console.log(namesIterator.next()); // { value: undefined, done: true }
    ```

    这里有一个新的表达式==yield*==

    * yield*表达式用于委托给另一个generator或可迭代对象

    * 实例

      ```js
      // 委托给其他生成器
      
      function* g1() {
        yield 2;
        yield 3;
        yield 4;
      }
      
      function* g2() {
        yield 1;
        yield* g1();
        yield 5;
      }
      
      var iterator = g2();
      
      console.log(iterator.next()); // { value: 1, done: false }
      console.log(iterator.next()); // { value: 2, done: false }
      console.log(iterator.next()); // { value: 3, done: false }
      console.log(iterator.next()); // { value: 4, done: false }
      console.log(iterator.next()); // { value: 5, done: false }
      console.log(iterator.next()); // { value: undefined, done: true }
      ```

      ```js
      // 委托给替他可迭代对象
      
      function* g3() {
        yield* [1, 2];
        yield* "34";
        yield* arguments;
      }
      
      var iterator = g3(5, 6);
      
      console.log(iterator.next()); // { value: 1, done: false }
      console.log(iterator.next()); // { value: 2, done: false }
      console.log(iterator.next()); // { value: "3", done: false }
      console.log(iterator.next()); // { value: "4", done: false }
      console.log(iterator.next()); // { value: 5, done: false }
      console.log(iterator.next()); // { value: 6, done: false }
      console.log(iterator.next()); // { value: undefined, done: true }
      ```

      ```js
      // yield*表达式的值
      // yield*是一个表达式，不是语句，所以它会有自己的值
      
      function* g4() {
        yield* [1, 2, 3];
        return "foo";
      }
      
      var result;
      
      function* g5() {
        result = yield* g4();
      }
      
      var iterator = g5();
      
      console.log(iterator.next()); // { value: 1, done: false }
      console.log(iterator.next()); // { value: 2, done: false }
      console.log(iterator.next()); // { value: 3, done: false }
      console.log(iterator.next()); // { value: undefined, done: true },
                                    // 此时 g4() 返回了 { value: "foo", done: true }
      
      console.log(result);          // "foo"
      ```

  * 第二个案例

    ```js
    function* createNumIterator(start, end) {
      while (start < end) {
        yield start++
      }
    }
    
    const numIterator = createNumIterator(10, 20)
    
    console.log(numIterator.next()); // { value: 10, done: false }
    console.log(numIterator.next()); // { value: 11, done: false }
    ```

  * 第三个案例

    ```js
    class ClassRoom {
      constructor(address, name, students) {
        this.address = address
        this.name = name
        this.students = students
      }
    
      entry(student) {
        this.students.push(student)
      }
    
      *[Symbol.iterator]() {
        yield* this.students
      }
    }
    
    const classRoom = new ClassRoom('三楼', 201, ['why', 'kobe', 'lgm'])
    const stuIterator = classRoom[Symbol.iterator]()
    
    console.log(stuIterator.next()); // { value: 'why', done: false }
    console.log(stuIterator.next()); // { value: 'kobe', done: false }
    ```

### 七、异步代码的处理方案
---

* 学完了我们前面的Promise、生成器等，我们来看一下异步代码的最终处理方案，也是为了引出async-await

  ```js
  function requestData(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(url)
      }, 2000)
    })
  }
  
  // 需求: 
  // 1> url: why -> res: why
  // 2> url: res + "aaa" -> res: whyaaa
  // 3> url: res + "bbb" => res: whyaaabbb
  ```

* 这是一下几种处理方案

  ```js
  // 回调地狱
  // 第一种
  requestData('why').then(res => {
    requestData(res + 'aaa').then(res => {
      requestData(res + 'bbb').then(res => {
        console.log(res);
      })
    })
  })
  ```

  这种方案称之为回调地狱，代码多了很不好管理。

  ```js
  // 第二种
  requestData('why').then(res => {
    return requestData(res + 'aaa')
  }).then(res => {
    return requestData(res + 'bbb')
  }).then(res => {
    console.log(res);
  })
  ```

  这种方案是利用Promise可以链式调用的这个特性，改编而来。

  ```js
  // 第三种
  function* getData() {
    const res1 = yield requestData('why')
    const res2 = yield requestData(res1 + 'aaa')
    const res3 = yield requestData(res2 + 'bbb')
    console.log(res3);
  }
  
  // const generator = getData()
  
  // 手动执行生成器函数
  // generator.next().value.then(res => {
  //   generator.next(res).value.then(res => {
  //     generator.next(res).value.then(res => {
  //       console.log(res);
  //     })
  //   })
  // })
  
  // 封装的自动执行生成器函数
  // function execGenerator(genFn) {
  //   const generator = genFn()
  //   function exec(res) {
  //     const result = generator.next(res)
  //     if (result.done) return result.value
  //     result.value.then(res => {
  //       exec(res)
  //     })
  //   }
  //   exec()
  // }
  
  // execGenerator(getData)
  
  
  // npm库里有这样一个插件co，自动执行生成器函数
  const co = require('co')
  co(getData)
  ```

  上面这段代码是以生成器来实现的一种方案，虽然这种方案已经很通俗易懂了，但是这并不是最终方案。

  ```js
  // 第四种
  async function getData() {
    const res1 = await requestData('why')
    const res2 = await requestData(res1 + 'aaa')
    const res3 = await requestData(res2 + 'bbb')
    console.log(res3);
  }
  
  getData()
  ```

  这是这几种方案最为简单的方案，也从而引出了async-await

# async - await

### 一、异步函数 async function

* async关键字用于声明一个异步函数：
  * async是asynchronous单词的缩写，异步、非同步；
  * sync是synchronous单词的缩写，同步、同时；

* async异步函数可以有很多种写法：

  ```js
  async function  foo1() {
    
  }
  
  
  var foo2 = async () => {
  
  }
  
  var foo3 = async function() {
  
  }
  
  class Person {
    async foo4() {
  
    }
  }
  ```

### 二、异步函数的执行流程

* 默认情况下，异步函数的内部代码和普通函数的执行流程是一样的

### 三、和普通函数的区别

* 第一个区别：

  * 异步函数有返回值时，和普通函数会有区别，异步函数的返回值一定是一个Promise，但是这个返回值有三种情况，和Promise的resolve值的情况一模一样

    ```js
    async function foo() {
      console.log('foo function 开始执行~');
    
      console.log('中间代码~');
    
      console.log('foo function 结束执行~');
      // 1、普通的值
    
      // 2、返回一个promise
      // return new Promise((resolve, reject) => {
      //   resolve(111)
      // })
    
      // 3、返回一个对象，并且对象实现了thenable
      // return {
      //   then: function(resolve, reject) {
      //     resolve(222)
      //   }
      // }
    }
    
    const promise = foo()
    promise.then(res => {
      console.log(res);
    })
    ```

* 第二个区别：

  * 普通函数如果抛出异常，那么整个函数都会报错，而异步函数不会，代码会继续执行，只不过，这个异常会被作为Promise的reject值

    ```js
    async function foo() {
      console.log('foo function 开始执行~');
    
      console.log('中间代码~');
      throw new Error('err message')
    
      console.log('foo function 结束执行~');
    }
    
    const promise = foo()
    promise.catch(err => {
      console.log(err);
    })
    ```

### 四、await关键字

* async函数另外一个特殊之处就是可以在它内部可以使用await关键字，而普通函数是不可以的
* await操作符用于等待一个Promise对象
* 语法：
  * [返回值] = await 表达式
  * 表达式：一个Promise对象或者任何要等待的值
  * 返回值：返回Promise对象的处理结果；如果等待的不是Promise对象，则返回该值本身。

* 特点：
  * await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function的执行，等待 Promise 处理完成。
  * 若Promise处理异常时，await表达式会把Promise的异常抛出，作为异步函数返回值的Promise的reject的值
  * 如果await操作符后的表达式的值不是一个Promise，则返回该值本身

* 案例：

  ```js
  // 如果一个 Promise 被传递给一个 await 操作符，await 将等待 Promise 正常处理完成并返回其处理结果。
  
  function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }
  
  async function f1() {
    var x = await resolveAfter2Seconds(10);
    console.log(x); // 10
  }
  f1();
  ```

  ```js
  // 如果该值不是一个 Promise，await 会把该值转换为已正常处理的Promise，然后等待其处理结果。
  
  async function f2() {
    var y = await 20;
    console.log(y); // 20
  }
  f2();
  ```

  ```js
  // 如果await后面的表达式，返回的Promise是reject的状态，那么会将这个reject结果直接作为函数的Promise的
  reject值；
  
  async function foo() {
    const res = await new Promise((resolve, reject) => { reject(222) })
  
    // 后面的代码不执行
    console.log('后面的代码1', res);
    console.log('后面的代码2');
    console.log('后面的代码3');
  }
  
  foo().catch(err => {
    console.log(err); // 222
  })
  ```

  

