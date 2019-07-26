# Podium ES modules prototype

This prototype is using Podium to build standalone fragments and composing them
together into a full page. The focus of the prototype is to optimize development
and serving of browser side javascript.

## Get up and running

This explains how to get up and running:

### Installation and running the prototype

This prototype has five podlet servers (standalone fragments aka "podlets") and
one layout server.

To get started, in each server directory run the following command to install
dependencies:

```sh
npm install
```

One can now start each server by running the following command in each server
directory:

```sh
npm start
```

Each server will then run on its own http port:

Layout: [http://localhost:7000](http://localhost:7000)
Header podlet: [http://localhost:7100](http://localhost:7100)
Footer podlet: [http://localhost:7200](http://localhost:7200)
Auth podlet: [http://localhost:7300](http://localhost:7300)
Geo podlet: [http://localhost:7400](http://localhost:7400)
Image podlet: [http://localhost:7500](http://localhost:7500)

### Build assets

Each server has its source for the browser side assets located under
`{server-directory}/assets`. Each server are though serving its browser
side assets from `{server-directory}/public` which is not checked into
this repo.

The browser side assets needs to be built into `{server-directory}/public`
before each server can serve something usefull. This is done by running
the following command in each servers directory:

```sh
npm run build
```

## The approache

This prototype explore serving browser side javascript as ES Modules in a
"microfrontend" setup. The goal of this prototype is to create a strategy
for making it easy to develop in isolation but also maximize performance
in such a setup.

### Current challenges

In a "microfrontend" setup when developing in isolation and composing
runtime we see some challenges regarding client side assets:

 * Multiple podlet can pull in the same library resulting in duplicates when composed together in a layout.

### ES Modules

ES Modules are at a stage where we can start using them. In our case
(FINN.no) the amount of browsers not supporting ES Modules are arount
1% of our traffic and comes more or less off only from IE11 users.

There are a couple of very important aspects to know about ES Modules
here:

 * If a ES Module is refered to multiple times, the browser will only load it once.
 * ES Modules does not have a global scope.
 * ES Module import specifiers can refer to an absolute URL.

We should also be aware that legal ES Modules import specifiers only
can be an absolute URL or start with one of the following `/`, `./`
or `../`.

```js
import { foo } from 'http://cdn.foo.com/a.js';
import { foo } from '../a.js';
import { foo } from './b.js';
import { foo } from '/c.js';
```

In addition to this its common to use whats called a "bare" import
specifier.

```js
import { foo } from 'a-library';
```

A "bare" import specifier is normally used to refere to a installed
library, ex from npm, which through a build step is replaced with a
legal import specifier, normally `/`, `./` or `../`, during development
and built for production deployment.

For more about how ES Modules work, this is a good read: [https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)

### Bundling, modules and HTTP/2

The ideal solution would be if one could serve ES Modules unbundeled.

With HTTP/1 this is not plausable due to the amount of HTTP request
roundtrips but there is a theory that with HTTP/2 one can let the
protocol do the bundling.

We have done some internal tests on serving unbundeled ES Modules over
HTTP/2 and what we see is that up to a couple of handfull of files
HTTP/2 does perform on the level of bundling these files into one
file and serving it on HTTP/1.

Any more files above a couple of handfulls and the protocol is not
efficient enough to replace bundling.

There is also an aspect of runtime performance hitting the js engine
with unbundeled modules: [https://twitter.com/paul_irish/status/979867890080915456](https://twitter.com/paul_irish/status/979867890080915456)

### CDN

A couple of CDNs specialised in serving javascript assets does apply
some very handy techniques by redirecting semver versions to exact
versions.

As an example, using the `^1` in the URL like this to `lit-html`:

```sh
https://unpkg.com/lit-html@^1/lit-html.js
```

will do a HTTP 302 redirect to the latest 1.x version of `lit-html`:

```sh
https://unpkg.com/lit-html@1.1.1/lit-html.js
```

The redirect URL tend to have a `Expires` or `Cache-Control` header
with a short cache time. The final URL one get redirected too has
a never expire or long cache time header.

### Organizational structure

In a "microfrontend" architecture the goal is _NOT_ to mix every
possible framework into a single page. Though; it should be possible
to mix frameworks of similar functionallity (ex, when transiting
from old framework X to new and shiny framework Y).

In a "microfrontend" architecture the goal is to isolate parts of
a page and make it possible to deploy indivitual parts to production
without having to deploy every bits and pice which goes into the
page.

Despite that teams should be autonomous there are benefits in agreeing
on some common shared parts.

For FINN.no its perfectly fine that a frontend infrastructure team,
which is responsible for the overall frontend of our site, dictate some
common libraries and which version of them which should be available
for each of the other teams to use.

### Making this work

In our set up, there will be a set of global libraries. These are
libraries which is highly likely to be used by multiple podlets.
As an example one such library might be `lit-html`. At FINN.no
the frontend infrastructure team will dictate which libraries
these are and what versions whould be available.

These libraries will be uploaded to a CDN as ES Modules. The CDN will
be serving files on HTTP/2 and each library will have a major URL which
will redirect to the latest version of the library simmilar to whats
described under [CDN](CDN).

An overview of these libraries and their availabillity on the
CDN will be provided in a `import-map` as follow:

```js
{
    imports: {
        'lit-html': 'https://cdn.finn.no/lit-html/^1',
        'preact': 'https://cdn.finn.no/preact/^8',
    }
}
```

When developing podlets one write browser side javascript as ES
Modules and install libraries through NPM as usual. This way, its
possible to have a totally isolated development process locally
and one can be offline during development.

In other words; developers will write import specifiers like so;

```js
import { * } as lit from 'lit-html';
import { sum } from './math/caclulate.js';
```

Here `lit-html` is a "bare" import specifier.

When a change in a browser side javascript is done and ready to
be used in production, one create a bundle of the browser side
javascript for the podlet by a build step.

In this build step the provided `import-map` file with global
libraries on the CDN is taken into acount and any "bare" import
specifiers in the podlets browser side javascript which match
with the global libraries in the `import-map` will be re-mapped
from a "bare" import specifier to an absolute URL on the CDN.

In other words; the above import specifiers will be remapped into
the following:

```js
import { * } as lit from 'https://cdn.finn.no/lit-html/^1';
import { sum } from './math/caclulate.js';
```

**NOTE:** We have already written a Rollup plugin for this which
are in use in this prototype: [https://github.com/trygve-lie/rollup-plugin-esm-import-to-url](https://github.com/trygve-lie/rollup-plugin-esm-import-to-url)

The podlets bundle are then uploaded to the same CDN as the
global libraries are located.

When different podlets are composed together into a layout
we will refere the browser side javascript with one script
tag for each podlet:

```html
<head>
    <script type="module" src="https://cdn.finn.no/podlet-header/main.js"></script>
    <script type="module" src="https://cdn.finn.no/podlet-main/main.js"></script>
    <script type="module" src="https://cdn.finn.no/podlet-footer/main.js"></script>
</head>
```

### Benefit - HTTP/2

A layout rarelly contain more than a handfull podlets. Due to this,
including a browser bundle for each podlet from the same CDN in a
layout matches very well with when we see that HTTP/2 perform good
enought compared with bundling.

In other words; having a handfull of bundles served from a CDN
over HTTP/2 perform the same as bundling these into one file
up front.

This free us from making one bundle pr layout.

### Benefit - Global libraries and import mapping

Due to the fact that ES Modules will not load the same script twice
when refered to multiple times there are no performance issues having
two bundles refering the same global library.

By doing the semver redirect on global libraries, as mentioned under
[CDN](CDN), we are equaling out minor versions into one common version.

In other words; one podlet can locally be developed using `lit-html`
version 1.1.0 while a second podlet can be developed using version
1.1.1 locally, but both get version 1.1.1 in production.

There are off cause a danger here that a podlet break when executed
with a different versions when loaded in production. This is though
why the redirects on the CDN is scoped to major semver versions.
Breaking changes should only happen between major versions and by
scoping to those in the import mapping, one force developers to manually
bump and test an upgrade before pushing to production.

### Benefit - Traditional HTTP caching

Due to the fact that we have global libraries and each podlet have its
own bundle we are able to utilize http caching.

Lets say we have two layouts on two URLs where both include a set of
podlets:

 - Layout A on https://finn.no
    - Includes `header` podlet
    - Includes `matrix` podlet
    - Includes `footer` podlet
 - Layout B on https://finn.no/search
    - Includes `header` podlet
    - Includes `search` podlet
    - Includes `footer` podlet

When a user access layout A the javascript bundle for all podlets will
be loaded from the CDN.

When the user navigate to layout B only one podlet on the page are
different from the previous layout. The javascript bundle for the `header`
and `footer` bundle was previously loaded and cached in the browser to
in this case only the javascript bundle for the `search` podlet needs
to be fetched from the CDN.

In other words; by writing podlets and publishing its javascript assets
as bundles we get "code splitting" for free.

### Benefit - Side effect free duplication when wanted

In theory, and depending on how libraries are written, based on the
fact that ES Modules does not have a global it is possible to have
two versions of the same library in the same layout without the
libraries kicking the feet of each other.

In other words, if a layout include podlet `A`, `B` and `C`, and
podlet `A` and `B` use new and shiny `lit-html` version 2.0.0 like
this:

```js
import { * } as lit from 'https://cdn.finn.no/lit-html/^2';
```

while podlet `C` are a bit behind and use version 1.0.0 like this:

```js
import { * } as lit from 'https://cdn.finn.no/lit-html/^1';
```

this should not cause problems for each podlet included in a layout
due to how ES Modules work.

There are though an issue of douple loading two versions of the same
global library in a layout.

### Future - Import maps

In this approach we are mapping "bare" import specifiers to
absolute URLs during an build step. This mapping is done by
providing a `import-map` to a Rollup plugin.

The usage of a `import-map` for this is deliberate due to the
fact that in close future browsers will support `import-maps`
and this mapping can be done in the browser instead of up front.

The need for doing this mapping in a build step is very likely to
be obsolete.

### Future - Service Workers

One of the reasons we have build Podium for composing microfrontends
instead of using SSI or ESI are due to the fact that there is value
in having more info about each podlet in a layout than what one can
get from just including a bit of markup.

In Podium the layout know a good deal about each podlet it includes
and this info can be used to automatically build service workers.

By doing so, its possible for us to make service workers which cache
all assets in a layout automatically and update these automatically
when a podlet changes improving further load speed.

Service worker support has to be built for Podium. It does not exist
at the moment.
