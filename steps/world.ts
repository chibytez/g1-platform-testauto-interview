// world.ts
import { setWorldConstructor, IWorldOptions, World } from "@cucumber/cucumber";
import { ITestController } from "../runnerConfiguration/runner";

interface Book {
  title: string;
  publishDate: string;
}
class CustomWorld extends World implements ITestController {
  public page: ITestController['page'];
  public books?: Book[];

  constructor(options: IWorldOptions) {
    super(options);
    this.page = options.parameters.page;
  }

  debug = false;

  async attachImplementation(): Promise<void> {
    // Implementation for attach method
  }

  async logImplementation(): Promise<void> {
    // Implementation for log method
  }
}
setWorldConstructor(CustomWorld);
export { CustomWorld, Book };