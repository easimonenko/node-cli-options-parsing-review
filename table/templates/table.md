| # | NPM Package | NPM Stars | Deprecated | Last Version | Last Update | Created | Dependencies |
|-|-|-|-|-|-|-|-|
{{#each packages}}
| {{number}} | [{{npmName}}](https://www.npmjs.org/package/{{npmName}}) | {{npmStars}} | {{#if deprecated}}V{{/if}} | {{lastVersion}} | {{lastUpdate}} | {{created}} | {{dependencies}} |
{{/each}}

| # | NPM Package | GitHub Repository | GitHub Stars | Last Commit |
|-|-|-|-|-|
{{#each packages}}
| {{number}} | [{{npmName}}](https://www.npmjs.org/package/{{npmName}}) | [{{githubName}}](https://github.com/{{githubName}}) | {{githubStars}} | {{lastCommit}} |
{{/each}}
