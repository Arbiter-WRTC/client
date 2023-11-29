![arbiter_banner](https://github.com/Arbiter-WRTC/client/assets/57457673/55b44136-8c74-4e0d-b970-b53eabdb020a)

## Overview

Arbiter's React SDK is built using React with Vite and Typescript.
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>

To use Arbiter's SDK, the Arbiter infrastructure must first be provisioned using the CLI tool. You can visit the arbiter-cli repository to complete this step if necessary. Once deployed, Arbiter's CLI tool will provide you with a `.env.local` file to use with Arbiter's SDK.

To integrate, first download the Arbiter npm package with
`npm install @Arbiter/SDK`

Then, import into your existing React application like the following example:
```ts
import Arbiter 'from @Arbiter/SDK';

const App = () => {
   # your code here...
   <Arbiter />;
};

export default App
```

INSERT PICTURE OF FRONTEND

Arbiter should work seamlessly with your existing frontend application, and room provisioning will be based on the URL path of the page in question. This allows you to integrate rooms dynamically based on the content. It is important to note that all users who visit that page will be able to join the call for that route, so adding authentication to prevent unauthorized use is a best practice when using Arbiter.

## The Team

**<a href="https://github.com/watzmonium" target="_blank">Stephen Watzman</a>** _Software Engineer_ • Detroit, MI

**<a href="https://github.com/frye-t" target="_blank">Tyler Frye</a>** _Software Engineer_ • Tampa Bay, FL

**<a href="https://github.com/jayjayabose" target="_blank">Jay Jayabose</a>** _Software Engineer_ • New York, NY



With Arbiter integrated in
