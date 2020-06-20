---
tags: ["java", "linux"]
date: "2020-06-15"
title: "Beating C with 33 Lines of Java"
author: Christian Köberl
summary: Writing a faster word count (wc) in Java.
---

After reading the "Beating C with X lines of Y" [^1] last year I immediately thought about trying this in my go-to language: Java. Now you might ask: "Java? Isn't Java known to have a slow startup and heavy memory footprint?" But let's see how Java performs - especially with its latest incarnation [GraalVM](https://www.graalvm.org/).

## Benchmarking

I will be using [GNU time](https://www.gnu.org/software/time/) for the time and memory comparison (same as the [Go version](https://ajeetdsouza.github.io/blog/posts/beating-c-with-70-lines-of-go/)):

```sh
$ /usr/bin/time -f "%es %MKB" wc lorem_ipsum.txt
  17023  782992 4830478 lorem_ipsum.txt
0.05s 2064KB
```

All results are from runs on my Laptop:
- Intel Core i7-8550U (4 cores, 8 threads)
- 16 GB RAM
- WSL2 running Arch Linux on Windows 10 (2004)

## The "standard" approach

The initial version I came up with used the obvious way in Java - reading the file using a `BufferedReader`:

```java
InputStream in = Files.newInputStream(Paths.get(fileName));
try (BufferedReader reader = new BufferedReader(new InputStreamReader())) {
  ...
}
```
([full code on GitHub](https://github.com/derkoe/wc-java/blob/master/wc_br.java))

Running some first tests with this code shows that it can't compete with the native `wc`:

| Implementation  | Input file    | Time  | Max memory |
| --------------  | ------------: | ----: | ---------: |
| wc              | 4.6MB         | 0.05s |    2,064KB |
| wc-br.java      | 4.6MB         | 0.24s |   40,188KB |
| wc              | 100MB         | 0.43s |    2,188KB |
| wc-br.java      | 100MB         | 1.21s |   45,036KB |

## Manual buffering

So let's try a more direct approach with manual buffering (inspired by the [Go version](https://ajeetdsouza.github.io/blog/posts/beating-c-with-70-lines-of-go/)):

```java
class wc {
  public static void main(String[] args) throws IOException {
    int lineCount = 0, wordCount = 0, charCount = 0, count;
    char[] cbuf = new char[16 * 1024];
    InputStream is = args.length == 0 ? System.in : Files.newInputStream(Paths.get(args[0]));
    try (Reader reader = new InputStreamReader(is)) {
      boolean prevWhitespace = true;
      while ((count = reader.read(cbuf)) >= 0) {
        for (int i = 0; i < count; i++) {
          char charVal = cbuf[i];
          charCount++;
          if (charVal == '\n') {
            lineCount++;
            prevWhitespace = true;
          } else if (isWhitespace(charVal)) {
            prevWhitespace = true;
          } else if (prevWhitespace) {
            wordCount++;
            prevWhitespace = false;
          }
        }
      }
    }
    // printing
  }
}
```
([full code on GitHub](https://github.com/derkoe/wc-java/blob/master/wc.java) - 33 lines of code according to [tokei](https://github.com/XAMPPRocky/tokei))

Let's try this version:


| Implementation  | Input file    | Time  | Max memory |
| --------------  | ------------: | ----: |   -------: |
| wc              | 4.6MB         | 0.05s |    2,064KB |
| wc.java         | 4.6MB         | 0.18s |   39,844KB |
| wc              | 100MB         | 0.43s |    2,188KB |
| wc.java         | 100MB         | 0.46s |   42,840KB |

Looking a lot better for big files (almost the same time) but still not that good for small ones. And the used memory is more than an order of magnitude higher: ~40MB vs 2MB.

## Enter GraalVM

[GraalVM](https://www.graalvm.org/) is a new ecosystem and platform for running Java and other programming languages (like JavaScript, Ruby or Python). One of main benefits for Java programs is to compile them to a native executable which reduces startup-time and memory usage.

Let's give it a try - after installing GraalVM and [native-image](https://www.graalvm.org/docs/reference-manual/native-image/) simply compile the Java class to a native binary with:

```sh
javac wc.java && native-image wc
```

which results in a native binary `wc` (or `wc.exe`) for your platform (currently cross-compilation is not supported).

When running the same code above with the native binary there are major improvements - here are the results plus a test with a 1GB file:

| Implementation  | Input file    | Time  | Max memory |
| --------------  | ------------: | ----: |   -------: |
| wc              | 4.6MB         | 0.05s |    2,064KB |
| wc.java (native)| 4.6MB         | 0.03s |    7,172KB |
| wc              | 100MB         | 0.43s |    2,188KB |
| wc.java (native)| 100MB         | 0.39s |    7,524KB |
| wc              | 1GB           | 4.20s |    2,120KB |
| wc.java (native)| 1GB           | 3.57s |   10,968KB |

Memory usage is down to 7MB for file up to 100 MB and we now easily beat the time of the C implementation. Still, the memory consumption is 3-5 time higher than the "real" native program.

## Summary

Java has come a long way - from Applets to enterprise server application and now microservices. Because of the J2EE/enterprise era it is known for heavy memory usage and slow startup times but in recent years Java has changed and adapted to the cloud native boom. With GraalVM and native images Java can now even compete with system languages like C, Go or Rust. With native image Java is now also a viable solution for building CLIs.


[^1]: [Ada](http://verisimilitudes.net/2019-11-11), [Go](https://ajeetdsouza.github.io/blog/posts/beating-c-with-70-lines-of-go/), [Haskell](https://chrispenner.ca/posts/wc), [Rust](https://medium.com/@martinmroz/beating-c-with-120-lines-of-rust-wc-a0db679fe920)
