# OS_Lab_EL

A collection of Operating Systems lab exercises, solutions, and supporting materials for the OS course.

## Table of Contents
- [About](#about)
- [Prerequisites](#prerequisites)
- [Repository structure](#repository-structure)
- [Build & Run](#build--run)
- [Labs (example)](#labs-example)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About
This repository contains lab assignments and example solutions for Operating Systems practicals (processes, scheduling, synchronization, memory management, file systems, etc.). It is arranged so students can build and run each lab independently.

## Prerequisites
- A Unix-like environment (Linux, macOS, WSL)
- GCC / Clang or other language toolchains used in the exercises
- make (optional, for provided Makefiles)
- qemu / bochs (if there are VM/OS kernel labs)

Install example (Debian/Ubuntu):

```bash
sudo apt update
sudo apt install build-essential make qemu-system-x86
```

## Repository structure
- labs/           - Lab statements and starter code
- solutions/      - Reference solutions (if provided)
- docs/           - Notes, diagrams, and write-ups
- scripts/        - Helper scripts and test harnesses
- reports/        - Lab submission templates and reports
- Makefile        - Top-level convenience targets (if present)

(If your repository layout is different, update this section.)

## Build & Run
General workflow (example):

```bash
# build everything (if Makefile provided)
make all

# build a single lab (example)
make lab1

# compile manually
gcc -Wall -O2 -o lab1/lab1 lab1/lab1.c
./lab1/lab1
```

For kernel/VM labs, use qemu:

```bash
qemu-system-x86_64 -kernel path/to/kernel.bin -nographic
```

## Deployment (Vercel) ⚙️
This project is a Next.js app and can be deployed to Vercel. Two simple steps:

1. Create a Vercel Personal Token at https://vercel.com/account/tokens and add it to your repository secrets as `VERCEL_TOKEN`.
2. (Optional) Add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` to target a specific team/project.

A GitHub Actions workflow is included at `.github/workflows/vercel-deploy.yml` which will build and deploy the app on pushes to `main`.

If you prefer to deploy from your machine instead of using the workflow:

```bash
# install vercel CLI and deploy (you will be prompted to login/link or supply a token)
npm i -g vercel
vercel --prod --token $VERCEL_TOKEN --confirm
```

If you need a Docker-based deploy or a custom setup, open an issue or tell me your preference and I can add it.

## Labs (example)
Each lab folder should include:
- README.md (lab-specific instructions)
- src/ or similar directory with source code
- tests/ with input/output test cases (optional)

Example:
```
labs/lab1/
  README.md
  src/
    lab1.c
  Makefile
```

## Contributing
- Fork the repository and create a feature branch.
- Add or update lab content and tests.
- Open a pull request describing your changes.

Please avoid committing compiled binaries unless they are necessary for grading.

## License
This repository is provided under the MIT License — see LICENSE for details. If you prefer another license, update this section.

## Contact
Maintainer: @Yash-Coder567
