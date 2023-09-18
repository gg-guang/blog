---
title: Promise
date: 2020/12/15
tags:
 - js
categories:
 - web
---

# Promise

### 一、为什么会有Promise？

---

* 异步请求的处理方式

  * 以前还没有promise的时候，下面这段代码就是处理异步请求的方式，封装的人可以理解，但是调用者却很不好理解，因为调用者压根就不知道这些参数是什么意思，可能到时候还要去看源码，没有一个规范；所以，在ES6(也就是ECMA2015)新增的一个规范，Promise。

    ```js
    // 模拟异步请求
    function requestData(url, successCallBack, errCallBack) {
      setTimeout(() => {
        if (url === 'coderwhy') {
          let names = ['avb', 'fgh', klj]
          successCallBack('成功了') // 成功的回调
        } else {
          let err = 'err message'
          errCallBack('失败了') // 失败的回调
        }
      }, 3000)
    }
    
    requestData('corderwhy', res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
    ```

### 二、什么是Promise？

---

* Promise的出现是为了解决历史残留问题而产生的，上面的例子，存在两个问题

  * 第一，我们需要自己设计回调函数，回调函数的名称、回调函数的使用等；

  * 第二，对于不同的人、不同的框架设计出来的方案都是不同的，那么我们必须耐心的去看别人的源码或者文档，才能明白这个函数到底怎么用；

* 我们来看一下Promise的基本使用

  * Promise是一个类，所以需要使用new关键字来创建对象，new Promise()括号中传入一个回调函数，这个函数会被立即执行，称为executor，

  * executor会有两个参数，这两个参数都是回调函数(resolve， reject)，

  * 当我们调用resolve回调函数时，会执行Promise对象的then方法传入的回调函数，

  * 当调用reject回调函数时，会执行Promise对象的catch方法传入的回调函数

    ```js
    const promise = new Promise((resolve, reject) => {
      console.log('立即执行'); // executor
      // resolve('成功') // 回调函数
      reject('失败')
    })
    
    // Promise在执行了resolve函数时，被回调
    promise.then(res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
    ```

* 我们来分析一下Promise的代码结构，下面的代码中我们可以将它分为三个状态
  * pending(待定，悬而未决的)，初始状态，当执行executor中的代码时，处于该状态
  * fulfilled(已兑现、已敲定)，意味着操作成功，当执行resolve时，处于该状态
  * rejected(已拒绝)，意味着操作失败，当 执行reject时，处于该状态

  > 注意：一旦状态被确定下来，Promise的状态会被锁死，该Promise的状态是不可更改

  ```js
      // Promise状态一旦被确定，那就是不可更改的
      new Promise((resolve, reject) => {
        // pending: 悬而未决的
        // 
        resolve('success message') // fulfilled: 已敲定
        // reject('err message') // rejected: 已拒绝
      }).then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
  ```

### 三、Promise的API

---

#### 1、executor

---

* 执行者，有两个参数，都是回调函数，resolve，reject

* 我们来说一下这个回调函数，在执行者中调用这两个回调函数，传入的参数

  * resolve的参数，有三中情况

    * 第一，传入的是普通的值或者对象

      ```js
      new Promise((resolve, reject) => {
        console.log('executor');
        resolve('ggg')
      }).then(res => {
        console.log(res); // ggg
      })
      ```

    * 第二，传入一个Promise，那么当前的Promise状态会由传入的Promise来决定，相当于状态进行了移交

      ```js
      const newPromise = new Promise((resolve, reject) => {
        console.log('executor');
        resolve('ggg')
      })
      
      new Promise((resolve, reject) => {
        console.log('lll');
        resolve(newPromise)
      }).then(res => {
        console.log('res:', res); // ggg
      })
      ```

    * 第三，传入一个对象，并且这个对象有实现then方法(并且这个对象是实现了thenable接口)，那么也会执行盖then方法，并且由该then方法决定后续状态

      ```js
      new Promise((resolve, reject) => {
        console.log('executor');
        const obj = {
          then: function(resolve, reject) {
            resolve('hh')
          }
        }
        resolve(obj)
      }).then(res => {
        console.log('res:', res); // hh
      })
      ```

  * reject参数，没有resolve那么特殊，传什么就是什么，没什么好说的

#### 2、对象方法then

---

* 接收两个参数
  * fulfilled的回调函数，当状态变成fulfilled时会回调的函数，成功的回调
  * rejected的回调函数，当状态变成rejected会回调的函数，失败的回调

  ```js
  const promise = new Promise((resolve, reject) => {
  resolve('hhh')
  // reject('hhhh')
  })
  
  promise.then(res => {
    console.log(res); // 成功的回调
  }, err => {
    console.log(err); // 失败的回调
  })
  ```

* 可以多次调用

   ```js
   promise.then(res => {
       console.log(res);
     }, err => {
       console.log(err);
     })
   
     promise.then(res => {
       console.log(res);
     })
   
     promise.then(res => {
       console.log(res);
     })
   ```

* 有返回值
  * 一个函数是有返回值的，而then方法也不例外，then方法的返回值是可以进行链式调用
  * 这个返回值会变成了一个新的Promise，新Promise会处于fulfilled状态，而返回的值是==新==Promise的resolve的参数
  * 返回值，返回的结果和resolve参数一样，也有三种情况
    * 第一，返回一个普通的值
    * 第二，返回一个Promise
    * 第三，返回一个对象，并且对象中实现了then方法，和上面resolve参数的情况一模一样，也没上面好说

#### 3、对象方法catch

---

* 可以多次调用

  ```js
  const promise = new Promise((resolve, reject) => {
    reject('hhh')
  })

  promise.catch(err => {
    console.log(err); // hhh
  })
  promise.catch(err => {
    console.log(err); // hhh
  })
  promise.catch(err => {
    console.log(err); // hhh
  })
  ```

* 当executor抛出异常时,也是会调用错误(拒绝)捕获的回调函数的

  ```js
  const promise = new Promise((resolve, reject) => {
    // 抛出异常
    throw new Error('报错啦')
  })

  promise.catch(err => {
    console.log(err);
    console.log('------------------');
  })
  ```

* 有返回值，和then方法的情况一模一样，值得一说的是，这个返回值会变成了一个新的Promise，新Promise会处于fulfilled状态，而返回的值是==新==Promise的resolve的参数，而不是reject参数，这个要注意一下，这里就不演示了

#### 4、对象方法finally

---

* ES9新增的一个特性，promise不管是在哪个状态下都会执行的，只有在pending的状态下不会执行

* finally不接受参数

  ```js
  const promise = new Promise((resolve, reject) => {
    // resolve('aaa')
    reject('bbb')
  })
  
  promise.then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err); // bbb
  }).finally(() => {
    console.log('finally'); //finally
  })
  ```

#### 5、类方法resolve

---

* 有时候我们已经有一个现成的内容，希望将其转成Promise来使用，这个时候我们可以使用Promise.resolve来完成

  * Promise.resolve的用法相当于new Promise，并且执行resolve操作

    ```js
    Promise.resolve('aaa')
    // 等价于
    new Promise((resolve) => resolve('aaa'))
    ```

* resolve参数的三种情况
  * 第一，参数是一个普通的值或者对象
  * 第二，参数本身是一个Promise
  * 第三，参数是对象，并且实现了then方法，和上面的一模一样的情况

#### 6、类方法reject

---

* reject方法类似于resolve方法，只是会将Promise对象的状态设置为rejected状态

* Promise.reject的用法相当于new Promise，只是会调用reject

  ```js
  Promise.reject('aaa')
  // 等价于
  new Promise((resolve, reject) => reject('aaa'))
  ```

* Promise.reject传入的参数无论是什么形态，都会直接作为rejected状态的参数传递到catch

#### 6、类方法all

---

* 这个方法的作用是将多个Promise包裹在一起形成一个新的Promise

* 参数是一个数组，数组里包裹的不只是Promise，还能是别的值，这个别的值的情况和上面resolve参数的情况一模一样

* 新的Promise状态由包裹的所有的Promise共同决定

  * 当所有的Promise状态都是fulfilled状态时，新的Promise的状态为fulfilled，并且会将所有的Promise的返回值组成一个数组

    ```js
    const promise1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('aaaa')
      }, 1000)
    })
    
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('bbbb')
      }, 2000)
    })
    
    const promise3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('cccc')
      }, 3000)
    })
    
    Promise.all([promise1, promise2, promise3]).then(res => {
      console.log(res); // [aaaa， bbbb,， cccc]
    }).catch(err => {
      console.log('err:', err);
    })
    ```

    

  * 当有一个Promise状态为rejected时，新的Promise状态为rejected，并且会将第一个reject的返回值作为参数

    ```js
    const promise1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('aaaa')
      }, 1000)
    })
    
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('bbbb')
      }, 2000)
    })
    
    const promise3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('cccc')
      }, 3000)
    })
    
    Promise.all([promise1, promise2, promise3]).then(res => {
      console.log(res);
    }).catch(err => {
      console.log('err:', err); // bbb
    })
    ```

>注意：

* *必须得等到所有的Promise都变成fulfilled状态，才能拿到结果*
* *在拿到所有结果之前, 有一个promise变成了rejected, 那么整个promise是rejected*

#### 7、类方法allSettled

---

* all方法有一个缺陷
  * 当其中有一个Promise变成rejeeted状态时，新的promise就会立即变成对应的rejected状态
  * 那么对于fulfilled状态的，以及依然处于pending状态的Promise，我们是获取不到对应的结果的
* 参数和all方法的一致

* 在ES11中，新增了一个API，Promise.allsettled

  * 该方法会等所有的Promise都有结果(settled)，无论是fulfilled还是rejected

  * 并且这个新的Promise的结果的状态一定是fulfilled

    ```js
    const promise1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('aaaa')
      }, 1000)
    })
    
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('bbbb')
      }, 2000)
    })
    
    const promise3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('cccc')
      }, 3000)
    })
    
    // Promise.allSettled方法不管是fulfilled和rejected状态，结果都会有
    Promise.allSettled([promise1, promise2, promise3]).then(res => {
      console.log(res);
    })
    
    // 结果
    // [
    //   { status: 'fulfilled', value: 'aaaa' },
    //   { status: 'rejected', reason: 'bbbb' },
    //   { status: 'fulfilled', value: 'cccc' }
    // ]
    ```

#### 8、类方法race

---

* race是竞赛、竞技的意思，表示多个Promise相互竞争，谁现有结果，就使用谁的结果

* 参数和all方法一致

  ```js
  const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('aaaa')
    }, 2000)
  })
  
  const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('bbbb')
    }, 1000)
  })
  
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('cccc')
    }, 3000)
  })
  
  // race: 竞赛
  // 哪个先有结果，Proimse.race就使用谁的结果
  Promise.race([promise1, promise2, promise3]).then(res => {
    console.log(res);
  }).catch(err => {
    console.log('err:', err);
  })
  ```

#### 9、类方法any

---

* 参数和all方法一致

* 类方法anyES12新增的方法

  * any方法会等到有一个Promise是fulfilled状态，才会决定新Promise的状态

  * 如果所有的Promise都是rejected状态，那么会报一个AggregateError错误,如果想要拿到参数，是要err.errors就能拿到，结果一个数组

    ```js
    const promise1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('aaaa')
      }, 1000)
    })
    
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('bbbb')
      }, 2000)
    })
    
    const promise3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('cccc')
      }, 3000)
    })
    
    // any
    // 会等到一个fulfilled状态，才会决定新Promise的状态
    // 如果所有的Promise都是reject的，那么也会等到所有的Promise都变成rejected状态
    Promise.any([promise1, promise2, promise3]).then(res => {
      console.log(res);
    }).catch(err => {
      // 如果都是rejected状态，AggregateError: All promises were rejected
      console.log('err:', err.errors); // ['aaaa', 'bbbb', 'cccc']
    })
    ```


### 四、手写Promise

---

##### 1、基本结构的设计

---

* Promise是一个类，创建Promise对象时，需要传一个回调函数，这个回调函数会被立即执行，称为executor；

* executor有两个参数，resolve、reject，

* 在executor中，是处于pending状态的，如果在executor中调用resolve，就是处于fulfilled状态，反之，调用了reject，就处于rejected状态，

* 了解这些基本的，我们就开始来设计一下代码结构

  ```js
  // 常量、状态
  const PROMISE_STATUS_PENDING = 'pending' // 等待
  const PROMISE_STATUS_FULFILLED = 'fulfilled' // 成功
  const PROMISE_STATUS_REJECTED = 'rejected' // 失败
  
  class HyPromise {
    constructor(executor) {
      this.status = PROMISE_STATUS_PENDING // 处于pending状态
      const resolve = (value) => {
        if (this.status === PROMISE_STATUS_PENDING) {
          this.status = PROMISE_STATUS_FULFILLED
          console.log('resolve');
        }
      }
  
      const reject = (reason) => {
        if (this.status === PROMISE_STATUS_PENDING) {
          this.status = PROMISE_STATUS_REJECTED
          console.log('reject');
        }
      }
  
      executor(resolve, reject) // 立即执行函数
    }
  }
  ```

##### 2、then方法的设计

---

* then()，有两个参数，这两个参数是两个回调函数，第一个参数是成功的回调(onFulfilled)，第二个参数是失败的回调(onRejected)，他们都有参数，他们的参数就是executor传入的两个参数

  ```js
  // 常量
  const PROMISE_STATUS_PENDING = 'pending'
  const PROMISE_STATUS_FULFILLED = 'fulfilled'
  const PROMISE_STATUS_REJECTED = 'rejected'
  
  class HyPromise {
    // 构造方法
    constructor(executor) {
      this.status = PROMISE_STATUS_PENDING // promise的状态
      this.onFulfilledFns = []
      this.onRejectedFns = []
  
      const resolve = (value) => {
        if (this.status === PROMISE_STATUS_PENDING) {
          this.status = PROMISE_STATUS_FULFILLED
          /**
           * 会报错，那是因为代码的执行顺序，因为在执行executor时，就执行了this.onFulfilled，
           * 但是这个时候this.fulfilled是undefined，因为，只有执行完这里，才能继续执行的下面的代码
           * 然而只有执行完下面的代码this.fulfilled才能有值，所以
           * 只能把这段代码加入微任务里
           */
          queueMicrotask(() => {
            this.onFulfilledFns.forEach(fn => {
              fn(value)
            }) 
          })
        }
      }
  
      const reject = (reason) => {
        if (this.status === PROMISE_STATUS_PENDING) {
          this.status = PROMISE_STATUS_REJECTED
          queueMicrotask(() => {
            this.onRejectedFns.forEach(fn => {
              fn(reason)
            })
          })
        }
      }
  
      executor(resolve, reject)
    }
  
    // then方法
    then(onFulfilled, onRejected) {
      this.onFulfilledFns.push(onFulfilled)
      this.onRejectedFns.push(onRejected)
    }
  }
  ```

##### 3、then方法的优化一

---

* 上面基本是把结构都写好了，但是还是有一点小缺陷

  ````js
  const hyPromise = new HyPromise((resolve, reject) => {
    console.log('HyPromise立即执行');
    resolve(111111)
    // reject(222222)
  })
  
  hyPromise.then(res => {
    console.log('HyPromise的res:', res);
  }, err => {
    console.log('HyPromise的err:', err);
  })
  
  setTimeout(() => {
    hyPromise.then(res => {
      console.log('HyPromise的res2:', res);
    }, err => {
      console.log('HyPromise的err:', err);
    })
  }, 2000)
  ````

  上面这段代码，换成Promise，上面then方法的结果应该有两个的，但是上面只有一个，那是因为setTimeout会慢2秒钟执行(我们称这个setTimeout里的then方法为②)，而就因为慢2秒钟执行，那个正常调用then方法(①)的时候，把状态改成了fulfilled了，所以，②在执行的时候，就不能调用传入的回调方法，所以就只有一个结果了

* 优化，在then方法里多做一层判断

  ```js
  then(onFulfilled, onRejected) {
      if (this.status === PROMISE_STATUS_FULFILLED) {
        onFulfilled(this.value)
      }
      if (this.status === PROMISE_STATUS_REJECTED) {
        onRejected(this.reason)
      }
      
      if (this.status === PROMISE_STATUS_PENDING) {
        this.onFulfilledFns.push(onFulfilled)
        this.onRejectedFns.push(onRejected)
      }
    }
  ```

##### 3、then方法的优化二

---

* then方法是可以有返回值的，有返回值是可以方便调用者可以进行链式调用

  ```js
  // 常量
  const PROMISE_STATUS_PENDING = 'pending'
  const PROMISE_STATUS_FULFILLED = 'fulfilled'
  const PROMISE_STATUS_REJECTED = 'rejected'
  
  // 判断是否是一个function
  function isFunction(value) {
    return typeof value === 'function'
  }
  
  // 判断是否是一个Object
  function isObject(value) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
  }
  
  // 工具函数
  function thenExecutorWithErr(value, execFn, resolve, reject) {
    try {
      const result = execFn(value)
      // 判断回调函数中的返回值是否是Promise对象
      if (isObject(result) && isFunction(result.then)) {
        if (result.status === PROMISE_STATUS_FULFILLED) {
          resolve(result.value)
        } else if (result.status === PROMISE_STATUS_REJECTED) {
          reject(result.reason)
        }
      } else {
        resolve(result)
      }
    } catch(err) {
      reject(err)
    }
  }
  
  class HyPromise {
    // 构造方法
    constructor(executor) {
      this.status = PROMISE_STATUS_PENDING // promise的状态
      this.onFulfilledFns = []
      this.onRejectedFns = []
      this.value = undefined
      this.reason = undefined
  
      const resolve = (value) => {
        if (this.status === PROMISE_STATUS_PENDING) {
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          /**
           * 会报错，那是因为代码的执行顺序，因为在执行executor时，就执行了this.onFulfilled，
           * 但是这个时候this.fulfilled是undefined，因为，只有执行完这里，才能继续执行的下面的代码
           * 然而只有执行完下面的代码this.fulfilled才能有值，所以
           * 只能把这段代码加入微任务里
           */
          queueMicrotask(() => {
            this.onFulfilledFns.forEach(fn => {
              fn(value)
            })
          })
        }
      }
  
      const reject = (reason) => {
        if (this.status === PROMISE_STATUS_PENDING) {
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          queueMicrotask(() => {
            this.onRejectedFns.forEach(fn => {
              fn(reason)
            })
          })
        }
      }
  
      executor(resolve, reject)
    }
  
    // then方法
    then(onFulfilled, onRejected) {
  
      return new HyPromise((resolve, reject) => {
        if (this.status === PROMISE_STATUS_FULFILLED) {
          // try {
          //   const value = onFulfilled(this.value)
          //   resolve(value)
          // } catch(err) {
          //   reject(err)
          // }
          thenExecutorWithErr(this.value, onFulfilled, resolve, reject)
        }
        if (this.status === PROMISE_STATUS_REJECTED) {
          // try {
          //   const reason = onRejected(this.reason)
          //   resolve(reason)
          // } catch(err) {
          //   reject(err)
          // }
          thenExecutorWithErr(this.reason, onRejected, resolve, reject)
        }
        
        if (this.status === PROMISE_STATUS_PENDING) {
          this.onFulfilledFns.push(() => {
            // try {
            //   const value = onFulfilled(this.value)
            //   resolve(value)
            // } catch(err) {
            //   reject(err)
            // }
            thenExecutorWithErr(this.value, onFulfilled, resolve, reject)
          })
          this.onRejectedFns.push(() => {
            // try {
            //   const reason = onRejected(this.reason)
            //   resolve(reason)
            // } catch(err) {
            //   reject(err)
            // }
            thenExecutorWithErr(this.reason, onRejected, resolve, reject)
          })
        }
      })
    }
  }
  ```

##### 4、catch方法的设计

---

* catch方法只有一个参数，onRejected回调函数

  ```js
  then(onFulfilled, onRejected) {
      const defaultRjected = (err) => { throw err }
      onRejected = onRejected || defaultRjected
  
      return new HyPromise((resolve, reject) => {
        if (this.status === PROMISE_STATUS_FULFILLED) {
          thenExecutorWithErr(this.value, onFulfilled, resolve, reject)
        }
        if (this.status === PROMISE_STATUS_REJECTED) {
          thenExecutorWithErr(this.reason, onRejected, resolve, reject)
        }
        
        if (this.status === PROMISE_STATUS_PENDING) {
          this.onFulfilledFns.push(() => {
            thenExecutorWithErr(this.value, onFulfilled, resolve, reject)
          })
          this.onRejectedFns.push(() => {
            thenExecutorWithErr(this.reason, onRejected, resolve, reject)
          })
        }
      })
    }
  
    // catch方法
    catch(onRejected) {
      return this.then(undefined, onRejected)
    }
  ```

  其他的代码没变

##### 5、finally方法的设计

---

* finally方法就是不管成功还是失败都会调用，这个就比较号理解了

  ```js
  then(onFulfilled, onRejected) {
      const defaultOnRjected = (err) => { throw err }
      onRejected = onRejected || defaultOnRjected
  
      const defaultOnFulfilled = (value) => { return value }
      onFulfilled = onFulfilled || defaultOnFulfilled
  
      return new HyPromise((resolve, reject) => {
        if (this.status === PROMISE_STATUS_FULFILLED) {
          thenExecutorWithErr(this.value, onFulfilled, resolve, reject)
        }
        if (this.status === PROMISE_STATUS_REJECTED) {
          thenExecutorWithErr(this.reason, onRejected, resolve, reject)
        }
        
        if (this.status === PROMISE_STATUS_PENDING) {
          this.onFulfilledFns.push(() => {
            thenExecutorWithErr(this.value, onFulfilled, resolve, reject)
          })
          this.onRejectedFns.push(() => {
            thenExecutorWithErr(this.reason, onRejected, resolve, reject)
          })
        }
      })
    }
    
    // finally方法
    finally(onFinally) {
      this.then(() => {
        onFinally()
      }, () => {
        onFinally()
      })
    }
  ```

##### 6、resolve-reject方法的设计

* 这两个方法是类方法，这也比较好理解了，上面说到，Promise.resolve的用法相当于new Promise，并且执行resolve操作；Promise.reject的用法相当于new Promise，只是会调用reject

  ```js
  // resolve
    static resolve(value)  {
      return new HyPromise((resolve, reject) => {
        resolve(value)
      })
    }
  
    // reject
    static reject(reason) {
      return new HyPromise((resolve, reject) => {
        reject(reason)
      })
    }
  ```

##### 7、all-allSettled方法的设计

* 搞清楚这两个方法，是 怎么执行的，就很好写代码了

  ```js
  // all
    static all(promises) {
      return new HyPromise((resolve, reject) => {
        const result = []
        promises.forEach(promise => {
          promise.then(res => {
            result.push(res)
            if (result.length === promises.length) {
              resolve(result)
            }
          }, err => {
            reject(err)
          })
        })
      })
    }
  
    // allSettled
    static allSettled(promises) {
      return new HyPromise((resolve, reject) => {
        const result = []
        promises.forEach(promise => {
          promise.then(res => {
            result.push({ status: PROMISE_STATUS_FULFILLED, value: res })
            if (result.length === promises.length) {
              resolve(result)
            }
          }, err => {
            result.push({ status: PROMISE_STATUS_REJECTED, reason: err })
            if (result.length === promises.length) {
              resolve(result)
            }
          })
        })
      })
    }
  ```

##### 8、race-any方法的设计

* 这两个方法和all方法很相似

  ```js
  // race
    static race(promises) {
      return new HyPromise((resolve, reject) => {
        promises.forEach(promise => {
          promise.then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      })
    }
  
    // any
    static  any(promises) {
      return new HyPromise((resolve, reject) => {
        const result = []
        promises.forEach(promise => {
          promise.then(res => {
            resolve(res)
          }, err => {
            result.push(err)
            if (result.length === promises.length) {
              reject(new AggregateError(result))
            }
          })
        })
      })
    }
  ```

##### 9、如果不明白这些代码是怎么写的，多去看看Promise是怎么用的，搞清楚代码的执行顺序

