# Document Generator (Handlebars)

## Commands

Run for Development
```bash
npm run electron:serve
```

Build for Production
```bash
npm run electron:build:win
```

Once built, it will appear in the `dist_electron` folder.

## Building Errors

I ran into several build errors, all of which had to do with file permissions being set to `root`. I had to `chown -R`
several folders until the build process finally ran properly. These issues appeared as missing files when in fact it was
a permission issue.

### Documentation
- [Multi-platform build: For Windows on Linux](https://www.electron.build/multi-platform-build#linux)
- [What is nodeIntegration?](https://stackoverflow.com/questions/57505082/would-it-be-safe-to-enable-nodeintegration-in-electron-on-a-local-page-that-is-p#answers-header)
- [Handling Static Assets](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#handling-static-assets)
- [extraResources](https://www.electron.build/configuration/contents#extraresources)

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
