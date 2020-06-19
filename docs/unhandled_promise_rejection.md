# 未处理的 Promise 异常

在 Express 框架内，可以用异步函数作为 handler 写入到路由定义中，如下：

```javascript
router.get('/', async function (req, res, next) {
  // ...
})
```

如果在 handler 函数内发生了异常，并且没有捕获处理，则会在控制台打印`UnhandledPromiseRejectionWarning`和异常信息。这样我们可以意识到异常的存在，但前端会始终 pending. 目前看来，这样的处理结果并无太大的不妥。
