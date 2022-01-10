import Main from './main'

(async () => {
    const main = new Main('./config.yaml')
    await main.prepare()
    await main.run()
    await main.finish()
    console.log(main.report.human().join('\n'))
})();