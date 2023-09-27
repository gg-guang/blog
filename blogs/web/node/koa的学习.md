# Koa的学习

## 一、安装koa

node必须是12及以上版本，且必须支持 ES2015 异步代码。

```js
npm i koa
```

## 二、初始化koa程序

记住，koa返回的是一个类，必须要创建实例，并不像express一样返回的是一个函数。

```js
const koa = require('koa')

const app = new koa()

app.use((ctx, next) => {
    ctx.body = 'hello world'
})

app.listen(8081, () => {
    console.log('koa服务器启动成功~')
})
```

启动程序 `nodemon index.js` 这样一个简单的koa程序就好了，我们在postman中测试一下。

![image-20230927172852075](http://me.gg.ln.cn/images/web/node/image-20230927172852075.png)

## 三、注册中间件

中间件就是函数，但是这个函数有两个参数 `context`和 `next`，context是上下文对象，它把node中的request和response对象封装到一个对象中，context对象还有很多属性，自行查阅文档https://koajs.com；next是一个函数，这是执行下一个中间件的函数，假如你有两个中间件，如果第一个中间件没有执行next()，那么第二个中间件将不会执行。

koa中怎么注册中间件，app.use(fn)，fn就是你要注册的中间件，.use方法中只能有一个参数，就是fn，不能像express中一样可以多个参数注册中间件，koa只能一个一个注册。

```js
app.use((ctx, next) => {
    console.log('第一个中间件')
    next()
    ctx.body = '注册中间件成功~'
})
app.use((ctx, next) => {
    console.log('第二个中间件')
})
```

执行，终端结果为

![image-20230927174233282](http://me.gg.ln.cn/images/web/node/image-20230927174233282.png)

## 四、路由

koa中没有集成router，所以必须安装一个库 @koa/router，来使用路由。

```js
npm install @koa/router
```

这边演示的只是其中一个用法，具体用法请查阅文档：https://github.com/koajs/router。

新建一个文件夹routes，在该文件中新建一个文件index.js。

```js
const Router = require('@koa/router')

const router = new Router({
  prefix: '/user'
})

router.get('/', (ctx, next) => {
  ctx.body = '用户接口~'
})

router.post('/', (ctx, next) => {
  ctx.body = '添加用户成功~'
})

router.get('/:id', (ctx, next) => {
  ctx.body = '查询用户成功~'
})

module.exports = router
```



```js
const koa = require('koa')

const router = require('./routes/index')

const app = new koa()

app.use(router.routes())

app.listen(8081, () => {
  console.log('koa服务器启动成功~');
})
```

![image-20230927175100315](http://me.gg.ln.cn/images/web/node/image-20230927175100315.png)

## 五、参数解析

* params

  请求路径为/user/:id，我们怎么能拿到id呢，

  ```js
  const koa = require('koa')
  
  const Router = require('@koa/router')
  const router = new Router()
  router.get('/user/:id', (ctx, next) => {
    console.log(ctx.request.params);
  
    ctx.body = '成功！'
  })
  
  const app = new koa()
  
  app.use(router.routes())
  
  app.listen(8081, () => {
    console.log('koa服务器启动成功~');
  })
  ```

* query

  请求路径为/user?name=小明，我们怎么拿到?后面的数据呢？

  ```js
  const koa = require('koa')
  
  const Router = require('@koa/router')
  const router = new Router()
  router.get('/user', (ctx, next) => {
    console.log(ctx.request.query);
  
    ctx.body = '成功！'
  })
  
  const app = new koa()
  
  app.use(router.routes())
  
  app.listen(8081, () => {
    console.log('koa服务器启动成功~');
  })
  ```

* body

  假如我们要添加一条数据，客户端传过来的是一个json数据，或者是一个表单和文字，这个时候我们该怎么能拿到这个数据呢，koa中并没有集成像query这样的参数，所以这个时候我们就要自己去安装一个库来解析，npm i @koa/bodyparser --save ，文档：https://github.com/koajs/bodyparser

  ```js
  const koa = require('koa')
  const bodyParser = require('koa-bodyparser')
  
  const Router = require('@koa/router')
  const router = new Router()
  router.post('/user', (ctx, next) => {
    console.log(ctx.request.body);
  
    ctx.body = '成功！'
  })
  
  const app = new koa()
  
  app.use(bodyParser())
  
  app.use(router.routes())
  
  app.listen(8081, () => {
    console.log('koa服务器启动成功~');
  })
  ```

* form-data

  有的时候客户端会上传文件，一般文件都是formdata格式，koa中也没有集成，所以也要安装一个库来帮助我们更方便的拿到数据，npm install --save @koa/multer multer ，文档：https://github.com/koajs/multer

  ```js
  const koa = require('koa')
  const multer = require('@koa/multer')
  
  const upload = multer({
    dest: './uploads'
  })
  
  const Router = require('@koa/router')
  const router = new Router()
  
  // add a route for uploading multiple files
  router.post(
    '/upload-multiple-files',
    upload.fields([
      {
        name: 'avatar',
        maxCount: 1
      },
      {
        name: 'boop',
        maxCount: 2
      }
    ]),
    ctx => {
      console.log('ctx.request.files', ctx.request.files);
      console.log('ctx.files', ctx.files);
      console.log('ctx.request.body', ctx.request.body);
      ctx.body = 'done';
    }
  );
  
  // add a route for uploading single files
  router.post(
    '/upload-single-file',
    upload.single('avatar'),
    ctx => {
      console.log('ctx.request.file', ctx.request.file);
      console.log('ctx.file', ctx.file);
      console.log('ctx.request.body', ctx.request.body);
      ctx.body = 'done';
    }
  );
  
  const app = new koa()
  
  app.use(bodyParser())
  
  app.use(router.routes())
  
  app.listen(8081, () => {
    console.log('koa服务器启动成功~');
  })
  ```

## 六、部署静态资源

koa程序就是一个服务，我们也可以自己部署静态资源，通过一个中间件，npm install koa-static ，文档：https://github.com/koajs/static#readme

```js
const koa = require('koa')
const koaStatic = require('koa-static')

const app = new koa()

app.use(koaStatic('./dist'))

app.listen(9081, () => {
  console.log('koa服务器启动成功~');
})
```

## 七、错误处理

在koa中处理Error呢？

```js
const koa = require('koa')

const app = new koa()

app.use((ctx, next) => {
  const isLogin = false
  if (isLogin) { 
    ctx.body = '成功'
  } else {
    ctx.app.emit('error', new Error('失败了'), ctx)
  }
})

app.on('error', (err, ctx) => {
  ctx.status = 401
  ctx.body = err.message
})

app.listen(8081, () => {
  console.log('koa服务器启动成功~');
})
```

这只是简单演示一下。

![image-20230927182133349](http://me.gg.ln.cn/images/web/node/image-20230927182133349.png)

## 八、完结 - 洋葱模型

koa的一个简单的学习，这里面还有很多值得学习的地方，还有一个重要的点就是koa可以编写异步代码，下一章我们就来简单阅读一下koa的源码，看一下koa是怎么实现的。